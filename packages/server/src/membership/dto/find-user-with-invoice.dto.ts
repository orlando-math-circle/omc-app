import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class FindUserWithInvoiceDto {
  @Type(() => Number)
  @IsNumber()
  readonly userId!: number;

  @IsString()
  readonly invoiceId!: string;
}
