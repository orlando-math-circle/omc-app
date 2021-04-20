import { IsDecimal, IsNumberString, IsOptional } from 'class-validator';

export class CreateEventFeeDto {
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  @IsNumberString()
  readonly amount!: string;

  @IsOptional()
  @IsNumberString()
  readonly lateAmount?: string;
}
