import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ConflictException,
  HttpException,
} from '@nestjs/common';
import { EventService } from '../event/event.service';
import { InvoiceStatus } from '../invoice/enums/invoice-status.enum';
import { InvoiceService } from '../invoice/invoice.service';
import { PayPalService } from '../paypal/paypal.service';
import { User } from '../user/user.entity';
import { EventRegistration } from './event-registration.entity';

export class EventRegistrationService {
  constructor(
    @InjectRepository(EventRegistration)
    private readonly repository: EntityRepository<EventRegistration>,
    private readonly invoiceService: InvoiceService,
    private readonly paypalService: PayPalService,
    private readonly eventService: EventService,
  ) {}

  public async create(eventId: number, invoiceId: string, user: User) {
    const [event, invoice] = await Promise.all([
      this.eventService.findOneOrFail(eventId, {
        registrations: { user: { id: user.id } },
      }),
      this.invoiceService.findOneOrFail({
        id: invoiceId,
        user: { id: user.id },
        event: { id: eventId },
      }),
    ]);

    // If no registrations are found, using .length on an uninitialized collection will throw.
    if (event.registrations.isInitialized() && event.registrations.length) {
      throw new ConflictException('Already registered');
    }

    if (!invoice || invoice.status === InvoiceStatus.COMPLETED) {
      throw new BadRequestException('Incomplete or missing invoice');
    }

    // Check the permissions, incredibly incomplete, requires talk with clients.
    // if (event.permissions) {
    //   // Maybe extract this to a method on the entity class.
    //   const canRegister = this.canRegister(event.permissions, user);

    //   if (!canRegister) throw new ForbiddenException();
    // }

    if (event.fee && !user.feeWaived) {
      const invoice = this.invoiceService.findOne({ user: user.id });

      if (!invoice) throw new HttpException('Payment required', 402);
    }

    const registration = this.repository.create({ user, event });

    await this.repository.persist(registration).flush();

    return registration;
  }

  /**
   * Creates a new PayPal order for an event and user.
   *
   * @param eventId ID of the event to create the fee order.
   * @param user User that is expecting payment.
   */
  public async createOrder(eventId: number, user: User) {
    const [event, invoice] = await Promise.all([
      this.eventService.findOneOrFail(eventId, {
        registrations: { user: { id: user.id } },
      }),
      this.invoiceService.findOne({
        event: { id: eventId },
        user: { id: user.id },
      }),
    ]);

    if (!event.fee || user.feeWaived) {
      throw new BadRequestException('Payment not required');
    }

    if (invoice) {
      // Should check if the invoice wasn't refunded or cancelled or something.
      // This level of checking is incomplete, and may confuse the frontend also.
      if (invoice.status === InvoiceStatus.COMPLETED) {
        return new BadRequestException('Payment already complete');
      }
    }

    return this.paypalService.createOrder(event.fee, event.id.toString());
  }

  public async captureOrder(orderId: string, eventId: number, user: User) {
    try {
      const [order, event] = await Promise.all([
        this.paypalService.getOrder(orderId),
        this.eventService.findOneOrFail(eventId),
      ]);

      // Determine that the order is consistent with the event.
      this.paypalService.validateCapture(
        order,
        'APPROVED',
        event.fee,
        event.id.toString(),
      );

      const captured = await this.paypalService.captureOrder(orderId);
      const capture = captured.purchase_units[0].payments.captures[0];

      return this.invoiceService.create(
        {
          id: order.id,
          purchasedAt: new Date(capture.create_time),
          fee: capture.seller_receivable_breakdown.paypal_fee.value,
          gross: capture.seller_receivable_breakdown.gross_amount.value,
          net: capture.seller_receivable_breakdown.net_amount.value,
        },
        event,
        user,
      );
    } catch (error) {
      // TODO: Catch the order not found and event not found errors.
      throw error;
    }
  }

  // private canRegister(permissions: EventPermissionsDto, user: User) {
  // if (user.age < permissions.age) get mad

  // if (user.grade && user.grade < permissions.grade) get mad.

  // return true;
  // }

  findOne(
    where: FilterQuery<EventRegistration>,
    populate?: boolean | string[],
  ) {
    return this.repository.findOne(where, populate);
  }

  findOwnRegistration(
    where: Omit<FilterQuery<EventRegistration>, 'user'>,
    populate?: any,
  ) {
    return this.repository.findOne(where, populate);
  }
}
