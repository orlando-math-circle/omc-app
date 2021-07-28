import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindAttendanceWithUserAndEventDto {
  @Type(() => Number)
  @IsNumber()
  readonly userId!: number;

  @Type(() => Number)
  @IsNumber()
  readonly eventId!: number;
}
