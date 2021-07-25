import { EntityRepository, FilterQuery, FindOptions } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Roles } from '@server/app.roles';
import { Event } from '@server/event/event.entity';
import { Account } from '../account/account.entity';
import { Populate } from '../app.utils';
import { AccessService } from '../auth/access.service';
import { EventService } from '../event/event.service';
import { CreateInvoiceDto } from '../invoice/dtos/create-invoice.dto';
import { InvoiceStatus } from '../invoice/enums/invoice-status.enum';
import { InvoiceService } from '../invoice/invoice.service';
import { PurchaseUnitRequest } from '../paypal/interfaces/orders/purchase-unit.interface';
import { PayPalService } from '../paypal/paypal.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { VolunteerUserJobDto } from './dtos/create-volunteer-registration.dto';
import { EventRegistrationStatus } from './dtos/event-registration-status.dto';
import { EventRegistration } from './event-registration.entity';

export class EventRegistrationService {
  constructor(
    @InjectRepository(EventRegistration)
    private readonly registrationRepository: EntityRepository<EventRegistration>,
    private readonly invoiceService: InvoiceService,
    private readonly paypalService: PayPalService,
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private readonly ac: AccessService,
  ) {}

  /**
   * Registers users to an event provided they meet the correct permissions
   * and have the necessary payments already completed.
   *
   * @param eventId Id of the event to register the user(s) to.
   * @param userIds Array of users to register.
   * @param author User initiating the registration.
   * @param account Account of the user initiating the registration.
   */
  public async create(
    eventId: number,
    userIds: number[],
    author: User,
    account: Account,
  ) {
    if (!account.primaryUser.emailVerified) {
      throw new ForbiddenException(
        'Email verification required to register to events',
      );
    }

    const event = await this.eventService.findOneOrFail(eventId, [
      'course.events',
      'course.fee',
      'fee',
    ]);

    if (event.isClosed) {
      throw new BadRequestException('Event registrations are closed');
    }

    if (event.course?.isClosed) {
      throw new BadRequestException('Course registrations are closed');
    }

    // Find any invoices for the provided users.
    await this.eventService.populate(event, ['fee.invoices'], {
      fee: {
        invoices: { user: userIds },
      },
    });

    const registrations: EventRegistration[] = [];
    const users = account.users.getItems();
    const fee = event.fee || event.course?.fee;

    for (const userId of userIds) {
      let user = users.find((u) => u.id === userId);

      if (!user) {
        if (this.ac.can(author, 'create:any', 'event-registration')) {
          user = await this.userService.findOneOrFail(userId);
        } else {
          throw new BadRequestException(`User ${userId} not found on account`);
        }
      }

      if (!event.hasPermission(user)) {
        throw new ForbiddenException();
      }

      if (fee && !user.feeWaived) {
        const invoice = fee.invoices
          .getItems()
          .find((i) => i.user.id === userId);

        if (!invoice) {
          throw new HttpException('Payment required', 402);
        }
      }

      registrations.push(this.registrationRepository.create({ user, event }));
    }

    await this.registrationRepository.persist(registrations).flush();

    return registrations;
  }

  /**
   * Registers users to an event as a volunteer.
   * Volunteers bypass all payment requirements.
   *
   * @param eventId Id off the event.
   * @param users Volunteer data for each user.
   * @param author User creating the volunteer registration.
   * @param eventRegistrationId The id of the event registration that contains the current user registered.
   */
  public async volunteer(
    eventId: number,
    users: VolunteerUserJobDto[],
    author: User,
    eventRegistrationId?: number,
  ) {
    if (!author.emailVerified) {
      throw new BadRequestException(
        'Email verification is required to volunteer',
      );
    }

    let event: Event;

    if (eventRegistrationId) {
      event = (await this.registrationRepository.findOneOrFail(eventRegistrationId, true)).event;
    } else {
      event = await this.eventService.findOneOrFail(eventId, [
        'author',
        'course.events',
      ]);
    }
    
    if (event.isClosed) {
      throw new BadRequestException('Event registrations are closed');
    }

    if (event.course?.isClosed) {
      throw new BadRequestException('Course registrations are closed');
    }

    const registrations: EventRegistration[] = [];
    const accountUsers = author.account.users.getItems();

    for (const { userId, job } of users) {
      let user = accountUsers.find((u) => u.id === userId);

      // Ensure if the account lacks this user, this is allowed.
      if (!user) {
        if (this.ac.can(author, 'create:any', 'volunteer-registration')) {
          user = await this.userService.findOneOrFail(userId);
        } else {
          throw new BadRequestException(`User ${userId} not found on account`);
        }
      }

      if (eventRegistrationId) {
        for (const reg of event.registrations) {
          if (reg.id === eventRegistrationId) {
            reg.user = user;
            reg.isSwap = false;
            this.registrationRepository.persist(reg).flush();
          }
        }
      } else {
        registrations.push(
          this.registrationRepository.create({
            user,
            event,
            isSwap: false,
            volunteering: true,
            job,
          }),
        );
      }
    }
      
    await this.registrationRepository.persist(registrations).flush();

    return registrations;
  }

  /**
   * Swaps the event registrations for each user.
   *
   * @param eventId Id off the event.
   * @param from User that is performing the swap.
   * @param fromId Id of the swapping user.
   * @param to User that is receiving the event swap.
   * @param toUsers Id of the receiving swap user.
   */
   public async swap(
    eventId: number,
    from: User,
    fromId: number,
    to: User,
    toUsers: VolunteerUserJobDto[],
  ) {
    this.volunteer(eventId, toUsers, to);
    this.delete(fromId, from);
    return this.registrationRepository.flush();
  }

  public async findAll(
    where: FilterQuery<EventRegistration>,
    options?: FindOptions<EventRegistration>,
  ) {
    return this.registrationRepository.findAndCount(where, options);
  }

  /**
   * Returns an array of event registrations that are currently in a swappable status.
   * 
   * @param eventId ID of the event.
   * @param user User of the person retrieving the event registrations.
   */
  public async getSwapRegistrations(eventId: number, user: User) {
    const event = await this.eventService.findOneOrFail(eventId);

    // Populate the event with swappable registrations that are not owned
    // by the requesting user.
    await this.eventService.populate(event, 
      ['fee.invoices', 'course.fee.invoices', 'registrations.user'],
      {
      registrations: {
        isSwap: true,
        user: { $ne: user.id },
      },
    });

    return event.registrations;
  }


  /**
   * Composite method for returning the status of each user on an account
   * for a specific event such as if each user is eligible and if they
   * have already paid for the event.
   *
   * @param eventId ID of the event.
   * @param account Account to retrive the statuses for.
   * @param user User of the person who is retrieving the event registrations.
   */
  public async getRegistrationStatus(eventId: number, account: Account, user: User) {
    const userIds = account.users.getIdentifiers();
    const event = await this.eventService.findOneOrFail(eventId, [
      'fee',
      'course.fee',
      'course.events',
    ]);

    await this.eventService.populate(
      event,
      ['fee.invoices', 'course.fee.invoices', 'registrations.user'],
      {
        fee: {
          invoices: { user: userIds },
        },
        course: {
          fee: {
            invoices: {
              user: userIds,
            },
          },
        },
        // registrations: { user: userIds },
        registrations: user.roles.includes(Roles.VOLUNTEER)
          ? {
              $or: [
                {
                  user: userIds,
                },
                { isSwap: true },
              ],
            }
          : {
              user: userIds,
            },
      },
    );

    const fee = event.fee || event.course?.fee;
    const retval: EventRegistrationStatus[] = [];

    for (const user of account.users) {
      const hasInvoice =
        fee && !!fee.invoices.getItems().find((i) => i.user.id === user.id);

      const registration =
        event.registrations.getItems().find((reg) => reg.user.id === user.id) ||
        false;

      retval.push({
        user,
        eligible: event.hasPermission(user),
        paid: fee ? hasInvoice : undefined,
        registration: registration,
      });
    }

    // Sort by eligibility with type coercion.
    return retval.sort((a, b) => Number(a.eligible) - Number(b.eligible));
  }

  /**
   * Creates a new PayPal order for an event and the provides user(s)
   *
   * @param eventId ID of the event to create the fee order.
   * @param users Users for registration to generate orders.
   */
  public async createOrder(eventId: number, account: Account, users: number[]) {
    if (!account.primaryUser.emailVerified) {
      throw new ForbiddenException('Please validate your email');
    }

    const event = await this.eventService.findOneOrFail(eventId, [
      'fee',
      'course.fee',
      'course.events',
    ]);

    // Disallow registration to in-progress or ended events.
    // if (event.isStarted || event.isEnded) {
    //   throw new BadRequestException(
    //     'Cannot register for in-progress or ended event',
    //   );
    // }

    // Try to find any existing registrations or invoices.
    await this.eventService.populate(
      event,
      ['fee.invoices', 'course.fee.invoices', 'registrations'],
      {
        fee: {
          invoices: { user: users },
        },
        course: {
          fee: {
            invoices: {
              user: users,
            },
          },
        },
        registrations: { user: { $in: users } },
      },
    );

    const fee = event.fee || event.course?.fee;

    if (!fee) {
      throw new BadRequestException('Event has no fee');
    }

    if (fee.invoices.length) {
      throw new BadRequestException('Invoice already exists');
    }

    let isLate = false;

    if (fee.lateAmount && parseFloat(fee.lateAmount) !== 0) {
      if (event.course) {
        isLate = event.course.isLate;
      } else {
        isLate = event.isLate;
      }
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
        amount: {
          currency_code: 'USD',
          value: isLate && fee.lateAmount ? fee.lateAmount : fee.amount,
        },
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
      this.eventService.findOneOrFail(eventId, ['fee', 'course.events']),
    ]);

    const fee = event.fee || event.course?.fee;

    if (!fee) {
      throw new BadRequestException('Event has no fee');
    }

    let isLate = false;

    if (fee.lateAmount && parseFloat(fee.lateAmount) !== 0) {
      if (event.course) {
        isLate = event.course.isLate;
      } else {
        isLate = event.isLate;
      }
    }

    const cost = isLate && fee.lateAmount ? fee.lateAmount : fee.amount;

    this.paypalService.validateCapture(order, 'APPROVED', cost);

    // WARNING: If this completes but subsequent code fails, money is taken but no registration.
    const capturedOrder = await this.paypalService.captureOrder(orderId);
    const createInvoiceDtos: CreateInvoiceDto[] = [];

    for (const purchase_unit of capturedOrder.purchase_units) {
      const capture = purchase_unit.payments.captures![0];

      createInvoiceDtos.push(
        Object.assign(
          {
            status: InvoiceStatus.COMPLETED,
            id: capture.id,
            amount: capture.seller_receivable_breakdown.paypal_fee.value,
            gross: capture.seller_receivable_breakdown.gross_amount.value,
            net: capture.seller_receivable_breakdown.net_amount.value,
            purchasedAt: new Date(capture.create_time),
            fee,
            user: +purchase_unit.reference_id!,
          },
          event.fee && { event },
          event.course?.fee && { course: event.course },
        ),
      );
    }

    return this.invoiceService.batchCreate(createInvoiceDtos);
  }

  findOne(
    where: FilterQuery<EventRegistration>,
    populate?: Populate<EventRegistration>,
  ) {
    return this.registrationRepository.findOne(where, populate);
  }

  findOwnRegistration(
    where: Omit<FilterQuery<EventRegistration>, 'user'>,
    populate?: any,
  ) {
    return this.registrationRepository.findOne(where, populate);
  }

  async delete(id: number, user: User) {
    const deleteAny = this.ac.can(user, 'delete:any', 'event-registration');

    let registration: EventRegistration;

    if (deleteAny) {
      registration = await this.registrationRepository.findOneOrFail(id, true);
    } else {
      registration = await this.registrationRepository.findOneOrFail(
        {
          id,
          user: user.account.users.getIdentifiers() as number[],
        },
        true,
      );
    }

    return this.registrationRepository.remove(registration).flush();
  }
}
