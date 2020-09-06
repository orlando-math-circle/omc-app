import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { Invoice } from './invoice.entity';
import { PopulateMap } from '@mikro-orm/core/typings';

export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: EntityRepository<Invoice>,
  ) {}

  findOne(where: FilterQuery<Invoice>, populate?: PopulateMap<Invoice>) {
    return this.invoiceRepository.findOne(where, populate);
  }

  findOneOrFail(where: FilterQuery<Invoice>, populate?: PopulateMap<Invoice>) {
    return this.invoiceRepository.findOneOrFail(where, populate);
  }
}
