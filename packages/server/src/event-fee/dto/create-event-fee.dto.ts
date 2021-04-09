import { IsNumberString, IsOptional } from 'class-validator';

export class CreateEventFeeDto {
  @IsNumberString()
  readonly amount!: string;

  @IsOptional()
  @IsNumberString()
  readonly lateAmount?: string;
}
