import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { LatePaymentType } from '../enums/late-payment-type.enum';
import { PaymentType } from '../enums/payment-type.enum';

export class CreateCourseDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(PaymentType)
  paymentType!: PaymentType;

  @IsEnum(LatePaymentType)
  latePaymentType!: LatePaymentType;

  @IsOptional()
  @IsString()
  fee?: string;

  @IsOptional()
  @IsString()
  lateFee?: string;

  @IsNumber()
  project!: number;

  @IsNumber({}, { each: true })
  events: number[];
}
