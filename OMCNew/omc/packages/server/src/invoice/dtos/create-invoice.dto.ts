import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Course } from '../../course/course.entity';
import { EventFee } from '../../event-fee/event-fee.entity';
import { Event } from '../../event/event.entity';
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

  @IsOptional()
  @IsNumber()
  readonly event?: number | Event;

  @IsOptional()
  @IsNumber()
  readonly course?: number | Course;

  @IsNumber()
  readonly fee!: number | EventFee;

  @IsNumber()
  readonly user!: number | User;
}
