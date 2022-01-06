import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsString, Matches } from 'class-validator';
import { User } from '../../user/user.entity';
import { InvoiceStatus } from '../enums/invoice-status.enum';

export class CreateInvoiceDto {
  @IsString()
  readonly id!: string;

  @IsEnum(InvoiceStatus)
  readonly status!: InvoiceStatus;

  @IsDate()
  @Type(() => Date)
  readonly purchasedAt!: Date;

  @IsString()
  @Matches(/^((-?[0-9]+)|(-?([0-9]+)?[.][0-9]+))$/)
  readonly gross!: string;

  @IsString()
  @Matches(/^((-?[0-9]+)|(-?([0-9]+)?[.][0-9]+))$/)
  readonly amount!: string;

  @IsString()
  @Matches(/^((-?[0-9]+)|(-?([0-9]+)?[.][0-9]+))$/)
  readonly net!: string;

  @IsNumber()
  readonly user!: number | User;
}
