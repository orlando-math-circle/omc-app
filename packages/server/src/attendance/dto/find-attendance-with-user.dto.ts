import { IsNumber } from 'class-validator';

export class FindAttendanceWithUserAndEventDto {
  @IsNumber()
  readonly userId!: number;

  @IsNumber()
  readonly eventId!: number;
}
