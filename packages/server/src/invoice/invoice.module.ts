import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EventFee } from '../event-fee/event-fee.entity';
import { InvoiceController } from './invoice.controller';
import { Invoice } from './invoice.entity';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [MikroOrmModule.forFeature([Invoice, EventFee])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
