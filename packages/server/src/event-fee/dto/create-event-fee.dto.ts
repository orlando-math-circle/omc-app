import { IsDecimal, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { FeeType } from '../../event/enums/fee-type.enum';

export class CreateEventFeeDto {
  @IsEnum(FeeType)
  readonly type?: FeeType;

  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  @IsNumberString()
  amount!: string;

  @IsOptional()
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  @IsNumberString()
  lateAmount?: string;
}
