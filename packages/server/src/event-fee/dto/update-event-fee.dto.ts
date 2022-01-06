import { IsDecimal, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { FeeType } from '../../event/enums/fee-type.enum';

export class UpdateEventFeeDto {
  @IsEnum(FeeType)
  readonly type?: FeeType;

  @IsOptional()
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  @IsNumberString()
  readonly amount!: string;

  @IsOptional()
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  @IsNumberString()
  readonly lateAmount?: string;
}
