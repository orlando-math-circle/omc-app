import { IsNumber, IsString } from 'class-validator';

export class InvoiceDto {
  @IsString()
  readonly invoiceId!: string;
}
