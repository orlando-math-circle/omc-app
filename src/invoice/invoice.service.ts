import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Populate, PopulateFail } from '../app.utils';
import { Event } from '../event/event.entity';
import { User } from '../user/user.entity';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { Invoice } from './invoice.entity';

export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: EntityRepository<Invoice>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto, event: Event, user: User) {
    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      event,
      user,
    });

    await this.invoiceRepository.persist(invoice).flush();

    return invoice;
  }

  findOne(where: FilterQuery<Invoice>, populate?: Populate<Invoice>) {
    return this.invoiceRepository.findOne(where, populate);
  }

  findOneOrFail(where: FilterQuery<Invoice>, populate?: PopulateFail<Invoice>) {
    return this.invoiceRepository.findOneOrFail(where, populate);
  }
}
