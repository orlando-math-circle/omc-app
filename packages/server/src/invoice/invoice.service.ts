import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Populate, PopulateFail } from '../app.utils';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { Invoice } from './invoice.entity';
import { EventFee } from '@server/event-fee/event-fee.entity';
import { Account } from '../account/account.entity';

export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: EntityRepository<Invoice>,
    @InjectRepository(EventFee)
    private readonly feeRepository: EntityRepository<EventFee>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const invoice = this.invoiceRepository.create(createInvoiceDto);

    await this.invoiceRepository.persist(invoice).flush();

    return invoice;
  }

  async findByCourse(id: number, account: Account) {
    const fee = await this.feeRepository.findOneOrFail({
      course: { id },
      invoices: {
        user: { id: { $in: account.users.getIdentifiers() as number[] } },
      },
    });

    return fee.invoices;
  }

  async findByEvent(id: number, account: Account) {
    const fee = await this.feeRepository.findOneOrFail({
      event: { id },
      invoices: {
        user: { id: { $in: account.users.getIdentifiers() as number[] } },
      },
    });

    return fee.invoices;
  }

  batchCreate(createInvoiceDtos: CreateInvoiceDto[]): Invoice[] {
    const invoices = createInvoiceDtos.map((dto) =>
      this.invoiceRepository.create(dto),
    );

    this.invoiceRepository.persist(invoices);

    return invoices;
  }

  findOne(where: FilterQuery<Invoice>, populate?: Populate<Invoice>) {
    return this.invoiceRepository.findOne(where, populate);
  }

  findOneOrFail(where: FilterQuery<Invoice>, populate?: PopulateFail<Invoice>) {
    return this.invoiceRepository.findOneOrFail(where, populate);
  }

  find(where: FilterQuery<Invoice>, populate?: Populate<Invoice>) {
    return this.invoiceRepository.find(where, { populate });
  }
}
