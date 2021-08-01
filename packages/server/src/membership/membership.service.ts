import { EntityRepository, FilterQuery, QueryOrderMap } from '@mikro-orm/core';
import { Account } from '../account/account.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Populate, PopulateFail } from '../app.utils';
import { Membership } from './membership.entity';
import { PurchaseUnitRequest } from '@server/paypal/interfaces/orders/purchase-unit.interface';
import { PayPalService } from '@server/paypal/paypal.service';
import { CreateInvoiceDto } from '@server/invoice/dtos/create-invoice.dto';
import { InvoiceStatus } from '@server/invoice/enums/invoice-status.enum';
import { InvoiceService } from '@server/invoice/invoice.service';
import { UserService } from '@server/user/user.service';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: EntityRepository<Membership>,
    private readonly paypalService: PayPalService,
    private readonly invoiceService: InvoiceService,
    private readonly userService: UserService,
  ) {}

  /**
   * Creates a membership for a user.
   *
   * @param userIds Array of users to register.
   * @param account Account of the user initiating the registration.
   */
  async create(userIds: number[], account: Account) {
    const memberships: Membership[] = [];
    const users = account.users.getItems();
    for (const userId of userIds) {
      let user = users.find((u) => u.id === userId);

      if (!user) {
        throw new BadRequestException(`User ${userId} not found on account`);
      }

      memberships.push(this.membershipRepository.create({ user }));
    }
    await this.membershipRepository.persist(memberships).flush();
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
    return this.membershipRepository.findOneOrFail(where, populate, orderBy);
  }

  /**
   * Retrieves all memberships given the specified query and pagination.
   * This method supports proxied MikroORM lookup features.
   *
   * @param limit Optional total number of entities to retrieve.
   * @param offset Optional number of entities to skip.
   */
  async findAll(limit: number, offset: number) {
    return this.membershipRepository.findAndCount({}, { limit, offset });
  }

  /**
   * Deletes a membership, if found, or throws a 404 Not Found Exception.
   *
   * @param id Membership ID.
   */
  async delete(id: number) {
    const membership = await this.membershipRepository.findOneOrFail(id);

    return this.membershipRepository.remove(membership).flush();
  }

  public async createOrder(account: Account, users: number[]) {
    if (!account.primaryUser.emailVerified) {
      throw new ForbiddenException('Please validate your email');
    }
    // calculate membership end date
    // get for which users
    // send invoice

    const purchaseUnits: PurchaseUnitRequest[] = [];

    for (const id of users) {
      const user = account.users.getItems().find((u) => u.id === id);
      let fee: string | undefined;
      if (!user) {
        // Could also be looked at as a forbidden error.
        throw new NotFoundException();
      }
      if (!user.grade) {
        throw new BadRequestException(
          `User ${id} is not assigned a grade level`,
        );
      }
      if (user.membershipFee) {
        fee = user.membershipFee;
      } else {
        throw new BadRequestException('No membership fee');
      }
      if (user.membership?.invoices) {
        throw new BadRequestException('Invoice already exists');
      }
      if (user.feeWaived) {
        throw new BadRequestException(`Payment not required for user ${id}`);
      }
      if (user.membership?.active) {
        throw new BadRequestException(`User ${id} is already a member`);
      }

      purchaseUnits.push({
        reference_id: id.toString(),
        amount: {
          currency_code: 'USD',
          value: fee as string,
        },
      });
    }

    return this.paypalService.createOrder(purchaseUnits);
  }

  //  must remove userID
  public async captureOrder(orderId: string) {
    const [order] = await Promise.all([this.paypalService.getOrder(orderId)]);
    // get fee, is this fee per user or total?
    let cost = ['25.00', '50.00'];
    // validate capture for each user.
    this.paypalService.validateCapture(order, 'APPROVED', cost);

    // WARNING: If this completes but subsequent code fails, money is taken but no registration.
    const capturedOrder = await this.paypalService.captureOrder(orderId);
    const createInvoiceDtos: CreateInvoiceDto[] = [];

    for (const purchase_unit of capturedOrder.purchase_units) {
      const capture = purchase_unit.payments.captures![0];

      createInvoiceDtos.push({
        status: InvoiceStatus.COMPLETED,
        id: capture.id,
        amount: capture.seller_receivable_breakdown.paypal_fee.value,
        gross: capture.seller_receivable_breakdown.gross_amount.value,
        net: capture.seller_receivable_breakdown.net_amount.value,
        purchasedAt: new Date(capture.create_time),
        user: +purchase_unit.reference_id!,
      });
    }

    return this.invoiceService.batchCreate(createInvoiceDtos);
  }
}
