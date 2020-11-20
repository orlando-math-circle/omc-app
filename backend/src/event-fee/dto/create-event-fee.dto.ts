import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { LateFeeMode } from '../enums/late-fee-mode.enum';

export class CreateEventFeeDto {
  @IsNumberString()
  readonly amount: string;

  @IsOptional()
  @IsNumberString()
  readonly lateAmount?: string;

  @IsEnum(LateFeeMode)
  readonly lateMode!: LateFeeMode;
}
