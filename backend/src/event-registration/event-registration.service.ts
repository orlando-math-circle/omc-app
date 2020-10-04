import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Account } from '../account/account.entity';
import { Populate } from '../app.utils';
import { AccessService } from '../auth/access.service';
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
import { EventRegistrationStatus } from './dtos/event-registration-status.dto';
import { EventRegistration } from './event-registration.entity';

export class EventRegistrationService {
  constructor(
    @InjectRepository(EventRegistration)
    private readonly regRepository: EntityRepository<EventRegistration>,
    private readonly invoiceService: InvoiceService,
    private readonly paypalService: PayPalService,
    private readonly eventService: EventService,
    private readonly ac: AccessService,
  ) {}

  /**
   * Registers users to an event provided they meet the correct permissions
   * and have the necessary payments already completed.
   *
   * @param eventId Id of the event to register the user(s) to.
   * @param users Array of users to register.
   * @param author User initiating the registration.
   * @param account Account of the user initiating the registration.
   */
  public async create(
    eventId: number,
    users: number[],
    author: User,
    account: Account,
  ) {
    const registrations: EventRegistration[] = [];
    const event = await this.eventService.findOneOrFail(eventId, ['course']);

    await this.eventService.populate(
      event,
      ['course.invoices', 'course.events', 'invoices'],
      {
        course: {
          invoices: { user: users },
        },
        invoices: { user: users },
      },
    );

    // If the author has admin privileges, they can force a registration.
    if (this.ac.can(author, 'create:any', 'event-registration')) return;

    for (const userId of users) {
      const user = account.users.getItems().find((user) => user.id === userId);

      // Ensure the user provided belong to the account.
      if (!user) {
        throw new BadRequestException(`User ${userId} not found on account`);
      }

      // Fee-waived students skip the invoice checks.
      if (user.feeWaived) return;

      if (event.course) {
        switch (event.course.paymentType) {
          case PaymentType.ALL:
            const courseInvoice = event.course.invoices
              .getItems()
              .find((invoice) => invoice.user.id === userId);

            if (!courseInvoice) {
              throw new HttpException('Course invoice not found', 402);
            }
            break;
          case PaymentType.SINGLE:
            const eventInvoice = event.invoices
              .getItems()
              .find((invoice) => invoice.user.id === userId);

            if (!eventInvoice) {
              throw new HttpException('Event invoice not found', 402);
            }
            break;
          case PaymentType.FREE:
            break;
          default:
            throw new InternalServerErrorException(
              'Unexpected course payment type',
            );
        }
      } else if (event.fee) {
        const eventInvoice = event.invoices
          .getItems()
          .find((invoice) => invoice.user.id === userId);

        if (!eventInvoice) {
          throw new HttpException('Event invoice not found', 402);
        }
      }

      // Check the permissions, incredibly incomplete, requires talk with clients.
      // if (event.permissions) {
      //   // Maybe extract this to a method on the entity class.
      //   const canRegister = this.canRegister(event.permissions, user);

      //   if (!canRegister) throw new ForbiddenException();
      // }

      registrations.push(this.regRepository.create({ user, event }));
    }

    await this.regRepository.persist(registrations).flush();

    return registrations;
  }

  public async getRegistrationStatus(eventId: number, account: Account) {
    const userIds = account.users.getIdentifiers();
    const event = await this.eventService.findOneOrFail(eventId);

    await this.eventService.populate(
      event,
      ['course.invoices', 'course.events', 'invoices', 'registrations'],
      {
        course: {
          invoices: { user: userIds },
        },
        invoices: { user: userIds },
        registrations: { user: userIds },
      },
    );

    const retval: EventRegistrationStatus[] = [];
    for (const user of account.users) {
      let hasInvoice: boolean;

      const hasFee =
        event.fee ||
        (event.course && event.course.paymentType !== PaymentType.FREE);

      console.log(hasFee);

      if (hasFee) {
        if (event.course && event.course.paymentType === PaymentType.ALL) {
          hasInvoice = !!event.course.invoices
            .getItems()
            .find((invoice) => invoice.user.id === user.id);
        } else if (
          (event.course && event.course.paymentType === PaymentType.SINGLE) ||
          event.fee
        ) {
          hasInvoice = !!event.invoices
            .getItems()
            .find((invoice) => invoice.user.id === user.id);
        }
      }

      const hasRegistration = !!event.registrations
        .getItems()
        .find((reg) => reg.user.id === user.id);

      retval.push({
        user,
        eligible: event.hasPermission(user),
        paid: hasFee ? hasInvoice : undefined,
        registered: hasRegistration,
      });
    }

    return retval;
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

    if (!cost) {
      throw new BadRequestException('Event has no cost');
    }

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

    if (!cost) {
      throw new BadRequestException('Event has no cost');
    }

    this.paypalService.validateCapture(order, 'APPROVED', cost);

    // WARNING: If this completes but subsequent code fails, money is taken but no registration.
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
        event:
          event.course?.paymentType === PaymentType.SINGLE ? event : undefined,
        course:
          event.course?.paymentType === PaymentType.ALL
            ? event.course
            : undefined,
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
