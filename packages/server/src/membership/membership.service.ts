import { FilterQuery, FindOptions, QueryOrderMap } from '@mikro-orm/core';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InvoiceStatus } from '../invoice/enums/invoice-status.enum';
import { InvoiceService } from '../invoice/invoice.service';
import { PurchaseUnitRequest } from '../paypal/interfaces/orders/purchase-unit.interface';
import { PayPalService } from '../paypal/paypal.service';
import { Account } from '../account/account.entity';
import { PopulateFail } from '../app.utils';
import { Invoice } from '../invoice/invoice.entity';
import { Grade } from '../user/enums/grade.enum';
import { User } from '../user/user.entity';
import { MembershipStatusDto } from './dto/membership-status-dto.interface';
import {
  HIGH_SCHOOL_MEMBERSHIP_FEE,
  MIDDLE_SCHOOL_MEMBERSHIP_FEE,
} from './membership.constants';
import { Membership } from './membership.entity';

@Injectable()
export class MembershipService {
  constructor(
    private readonly em: SqlEntityManager,
    private readonly paypalService: PayPalService,
    private readonly invoiceService: InvoiceService,
  ) {}

  /**
   * Creates a membership for a user.
   *
   * @param userIds Array of users to register.
   * @param account Account of the user initiating the registration.
   */
  async create(userIds: number[]) {
    const memberships = userIds.map((userId) =>
      this.em.create(Membership, {
        user: this.em.getReference(User, userId),
      }),
    );

    await this.em.persist(memberships).flush();

    return memberships;
  }

  /**
   * Retrieves a single membersip if possible or returns a 404 Not Found
   * exception. This method supports proxied MikroORM lookup features.
   *
   * @param where Id or query for selecting the entity.
   * @param populate Boolean or query for populating the entity.
   * @param orderBy Query for ordering by entity properties.
   */
  findOneOrFail(
    where: FilterQuery<Membership>,
    orderBy?: QueryOrderMap,
    populate?: PopulateFail<Membership>,
  ) {
    return this.em.findOneOrFail(Membership, where, populate, orderBy);
  }

  /**
   * Retrieves all memberships given the specified query and pagination.
   * This method supports proxied MikroORM lookup features.
   *
   * @param limit Optional total number of entities to retrieve.
   * @param offset Optional number of entities to skip.
   */
  async findAll(
    where: FilterQuery<Membership>,
    options?: FindOptions<Membership>,
  ) {
    return this.em.findAndCount(Membership, where, options);
  }

  /**
   * Deletes a membership, if found, or throws a 404 Not Found Exception.
   *
   * @param id Membership Id.
   */
  async delete(id: number) {
    const membership = await this.em.findOneOrFail(Membership, id, true);

    await this.em.remove(membership).flush();
  }

  /**
   * Retrieves the membership fee for a user, if appropriate.
   *
   * @param user User.
   */
  public getUserMembershipFee(user: User) {
    switch (user.grade) {
      case Grade.SIXTH:
      case Grade.SEVENTH:
      case Grade.EIGHTH:
        return MIDDLE_SCHOOL_MEMBERSHIP_FEE;
      case Grade.NINTH:
      case Grade.TENTH:
      case Grade.ELEVENTH:
      case Grade.TWELFTH:
        return HIGH_SCHOOL_MEMBERSHIP_FEE;
      default:
        return null;
    }
  }

  /**
   * Retrieves the membership status for the users of an account.
   *
   * @param account Account.
   */
  public async getMembershipStatuses(
    account: Account,
  ): Promise<MembershipStatusDto[]> {
    const userIds = account.users.getIdentifiers();

    const memberships = await this.em.find(Membership, {
      user: { id: { $in: userIds } },
    });

    return account.users.getItems().map((user) => {
      const membership = memberships.find((m) => m.user.id === user.id);

      return {
        user,
        fee: this.getUserMembershipFee(user),
        isMember: Boolean(membership?.isActive),
        membership,
      };
    });
  }

  /**
   * Creates a new PayPal order for a user paying to become a member.
   *
   * @param account Account of the user initiating the registration.
   * @param userIds Array of user identifiers on the account to register.
   */
  public async createOrder(account: Account, userIds: number[]) {
    const purchaseUnits: PurchaseUnitRequest[] = [];

    for (const userId of userIds) {
      const user = account.users.getItems().find((u) => u.id === userId);

      // Admins can make memberships directly using `create()`,
      // this method is only for the end-user PayPal flow.
      if (!user) {
        throw new NotFoundException(
          `User ${userId} is not part of your account`,
        );
      }

      if (user.isMember === null) {
        throw new InternalServerErrorException(
          `User ${userId} memberships unloaded`,
        );
      }

      if (user.isMember) {
        throw new BadRequestException(`User ${userId} is already a member`);
      }

      if (user.feeWaived) {
        throw new BadRequestException(`User ${userId} has been fee-waived`);
      }

      if (!user.grade) {
        throw new BadRequestException(`User ${userId} has no set grade`);
      }

      const fee = this.getUserMembershipFee(user);

      if (!fee) {
        throw new BadRequestException(
          'User grade is not membership appropriate',
        );
      }

      purchaseUnits.push({
        reference_id: userId.toString(),
        amount: {
          currency_code: 'USD',
          value: fee,
        },
      });
    }

    return this.paypalService.createOrder(purchaseUnits);
  }

  /**
   * Captures a PayPal order for user and creates the membership(s).
   *
   * @param orderId PayPal order id.
   */
  public async captureOrder(orderId: string) {
    const order = await this.paypalService.getOrder(orderId);

    // Verify the structure of the order and that each
    // purchase unit has an appropriate cost.
    // This could be done in a more robust way, but
    // the `createOrder` method already does this.
    this.paypalService.validateCapture(order, 'APPROVED', [
      MIDDLE_SCHOOL_MEMBERSHIP_FEE,
      HIGH_SCHOOL_MEMBERSHIP_FEE,
    ]);

    // WARNING: If this completes but subsequent code fails, money is taken but no registration.
    const capturedOrder = await this.paypalService.captureOrder(orderId);
    const memberships: Membership[] = [];

    for (const purchase_unit of capturedOrder.purchase_units) {
      const capture = purchase_unit.payments.captures![0];
      const user = this.em.getReference(User, +purchase_unit.reference_id!);

      memberships.push(
        this.em.create(Membership, {
          user,
          invoice: this.em.create(Invoice, {
            status: InvoiceStatus.COMPLETED,
            id: capture.id,
            amount: capture.seller_receivable_breakdown.paypal_fee.value,
            gross: capture.seller_receivable_breakdown.gross_amount.value,
            net: capture.seller_receivable_breakdown.net_amount.value,
            purchasedAt: new Date(capture.create_time),
            user,
          }),
        }),
      );
    }

    await this.em.persist(memberships).flush();

    return memberships;
  }
}
