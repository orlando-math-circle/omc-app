import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateAttendanceDto {
  @IsOptional()
  @IsBoolean()
  attended!: boolean;

  @IsOptional()
  @IsNumber()
  userId!: number;

  @IsOptional()
  @IsNumber()
  hours!: number;

  @IsOptional()
  @IsNumber()
  eventId!: number;

  @IsOptional()
  @IsNumber()
  jobId?: number;

  @IsOptional()
  @IsNumber()
  workId?: number;
}
