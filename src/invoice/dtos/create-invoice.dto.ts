import { Type } from 'class-transformer';
import { IsString, IsDate, Matches } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  readonly id!: string;

  @IsDate()
  @Type(() => Date)
  readonly purchasedAt!: Date;

  @IsString()
  @Matches(/^((-?[0-9]+)|(-?([0-9]+)?[.][0-9]+))$/)
  readonly gross: string;

  @IsString()
  @Matches(/^((-?[0-9]+)|(-?([0-9]+)?[.][0-9]+))$/)
  readonly fee: string;

  @IsString()
  @Matches(/^((-?[0-9]+)|(-?([0-9]+)?[.][0-9]+))$/)
  readonly net: string;
}
