import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class MarkAttendanceDto {
  @IsBoolean()
  readonly attended!: boolean;

  @IsNumber()
  readonly userId!: number;

  @IsNumber()
  readonly hours!: number;

  @IsNumber()
  readonly eventId!: number;

  @IsOptional()
  @IsNumber()
  readonly jobId?: number;

  @IsOptional()
  @IsNumber()
  readonly workId?: number;
}
