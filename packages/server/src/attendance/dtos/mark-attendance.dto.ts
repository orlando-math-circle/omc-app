import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class MarkAttendanceDto {
  @IsBoolean()
  attended!: boolean;

  @IsNumber()
  userId!: number;

  @IsNumber()
  hours!: number;

  @IsNumber()
  eventId!: number;

  @IsOptional()
  @IsNumber()
  jobId?: number;

  @IsOptional()
  @IsNumber()
  workId?: number;
}
