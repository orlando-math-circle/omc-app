import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Invoice } from './invoice.entity';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [MikroOrmModule.forFeature([Invoice])],
  controllers: [],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
