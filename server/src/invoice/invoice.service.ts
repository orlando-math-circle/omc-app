import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Populate, PopulateFail } from '../app.utils';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { Invoice } from './invoice.entity';

export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: EntityRepository<Invoice>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const invoice = this.invoiceRepository.create(createInvoiceDto);

    await this.invoiceRepository.persist(invoice).flush();

    return invoice;
  }

  async batchCreate(createInvoiceDtos: CreateInvoiceDto[]) {
    const invoices = createInvoiceDtos.map((dto) =>
      this.invoiceRepository.create(dto),
    );

    await this.invoiceRepository.persist(invoices).flush();

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
