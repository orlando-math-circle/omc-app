import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class FindEventWithInvoiceDto {
  @Type(() => Number)
  @IsNumber()
  readonly eventId!: number;

  @IsString()
  readonly invoiceId!: string;
}
