import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { AccessControl } from 'accesscontrol';
import { Account } from '../account/account.entity';
import { Populate } from '../app.utils';
import { InjectAC } from '../auth/decorators/inject-ac.decorator';
import { LatePaymentType } from '../course/enums/late-payment-type.enum';
import { PaymentType } from '../course/enums/payment-type.enum';
import { Event } from '../event/event.entity';
import { EventService } from '../event/event.service';
import { CreateInvoiceDto } from '../invoice/dtos/create-invoice.dto';
import { InvoiceStatus } from '../invoice/enums/invoice-status.enum';
import { InvoiceService } from '../invoice/invoice.service';
import { PurchaseUnitRequest } from '../paypal/interfaces/orders/purchase-unit.interface';
import { PayPalService } from '../paypal/paypal.service';
import { User } from '../user/user.entity';
import { EventRegistration } from './event-registration.entity';

export class EventRegistrationService {
  constructor(
    @InjectAC() private readonly ac: AccessControl,
    @InjectRepository(EventRegistration)
    private readonly regRepository: EntityRepository<EventRegistration>,
    private readonly invoiceService: InvoiceService,
    private readonly paypalService: PayPalService,
    private readonly eventService: EventService,
  ) {}

  public async create(
    eventId: number,
    invoiceIds: string[],
    author: User,
    userIds: number[],
  ) {
    const canCreateAny = this.ac.permission({
      role: author.roles,
      action: 'create:any',
      resource: 'invoice',
    }).granted;

    const invoices = await this.invoiceService.find(
      {
        id: { $in: invoiceIds },
        event: { id: eventId },
      },
      ['event', 'course.events', 'user'],
    );

    for (const userId of userIds) {
      if (
        !author.account.users.getIdentifiers().includes(userId) &&
        !canCreateAny
      ) {
        throw new BadRequestException('Cannot create invoice for another user');
      }
    }

    if (invoices.length !== userIds.length) {
      throw new BadRequestException('Invoices - user ids mismatch');
    }

    for (const invoice of invoices) {
      if (invoice.status !== InvoiceStatus.COMPLETED) {
        throw new BadRequestException('Incomplete invoice');
      }
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

    const registration = this.regRepository.create({ user, event });

    await this.regRepository.persist(registration).flush();

    return registration;
  }

  /**
   * Creates a new PayPal order for an event and the provides user(s)
   *
   * @param eventId ID of the event to create the fee order.
   * @param users Users for registration to generate orders.
   */
  public async createOrder(eventId: number, account: Account, users: number[]) {
    const event = await this.eventService.findOneOrFail(eventId, [
      'course.events',
    ]);

    // Disallow registration to in-progress or ended events.
    // if (event.isStarted || event.isEnded) {
    //   throw new BadRequestException(
    //     'Cannot register for in-progress or ended event',
    //   );
    // }

    // Try to find any existing registrations or invoices.
    await this.eventService.populate(event, ['registrations', 'invoices'], {
      registrations: { user: { $in: users } },
      invoices: { user: { $in: users } },
    });

    if (event.registrations.length) {
      throw new BadRequestException('Registration already exists');
    }

    if (event.invoices.length) {
      throw new BadRequestException('Invoice already exists');
    }

    const cost = this.getEventCost(event);
    const purchaseUnits: PurchaseUnitRequest[] = [];

    for (const id of users) {
      const user = account.users.getItems().find((u) => u.id === id);

      if (!user) {
        // Could also be looked at as a forbidden error.
        throw new NotFoundException();
      }

      if (user.feeWaived) {
        throw new BadRequestException(`Payment not required for user ${id}`);
      }

      purchaseUnits.push({
        reference_id: id.toString(),
        amount: { currency_code: 'USD', value: cost },
      });
    }

    return this.paypalService.createOrder(purchaseUnits);
  }

  /**
   * Consumes a PayPal order with the capture intent for the specified
   * event and the specified users.
   *
   * @param orderId ID of the PayPal generated order.
   * @param eventId ID of the event to map registrations to.
   */
  public async captureOrder(orderId: string, eventId: number) {
    const [order, event] = await Promise.all([
      this.paypalService.getOrder(orderId),
      this.eventService.findOneOrFail(eventId, ['course.events']),
    ]);

    const cost = this.getEventCost(event);
    this.paypalService.validateCapture(order, 'APPROVED', cost);

    const capturedOrder = await this.paypalService.captureOrder(orderId);
    const createInvoiceDtos: CreateInvoiceDto[] = [];

    for (const purchase_unit of capturedOrder.purchase_units) {
      const capture = purchase_unit.payments.captures[0];

      createInvoiceDtos.push({
        status: InvoiceStatus.COMPLETED,
        id: capture.id,
        fee: capture.seller_receivable_breakdown.paypal_fee.value,
        gross: capture.seller_receivable_breakdown.gross_amount.value,
        net: capture.seller_receivable_breakdown.net_amount.value,
        purchasedAt: new Date(capture.create_time),
        event,
        user: +purchase_unit.reference_id,
      });
    }

    return this.invoiceService.batchCreate(createInvoiceDtos);
  }

  /**
   * Gets the cost of an event from its fee or associated course.
   *
   * @param event Event the fee will be extracted from.
   */
  private getEventCost(event: Event) {
    // Events without a course are single-fee or free.
    if (!event.course) {
      return event.fee;
    }

    const isLate = event.course.events[0].isStarted;

    if (isLate) {
      switch (event.course.latePaymentType) {
        case LatePaymentType.DENY:
          throw new BadRequestException('Late registration is disabled');
        case LatePaymentType.LATEFEE:
          return event.course.lateFee;
        case LatePaymentType.DEFAULT:
          break; // Fall through to normal payment method.
        default:
          throw new BadRequestException('Unknown late payment mode');
      }
    }

    switch (event.course.paymentType) {
      case PaymentType.FREE:
        return null;
      case PaymentType.ALL:
      case PaymentType.SINGLE:
        return event.course.fee;
      default:
        throw new BadRequestException('Unknown payment mode');
    }
  }

  findOne(
    where: FilterQuery<EventRegistration>,
    populate?: Populate<EventRegistration>,
  ) {
    return this.regRepository.findOne(where, populate);
  }

  findOwnRegistration(
    where: Omit<FilterQuery<EventRegistration>, 'user'>,
    populate?: any,
  ) {
    return this.regRepository.findOne(where, populate);
  }
}
