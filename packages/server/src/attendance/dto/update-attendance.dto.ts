import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateAttendanceDto {
  @IsOptional()
  @IsBoolean()
  readonly attended?: boolean;

  @IsOptional()
  @IsNumber()
  readonly userId?: number;

  @IsOptional()
  @IsNumber()
  readonly hours?: number;

  @IsOptional()
  @IsNumber()
  readonly eventId?: number;

  @IsOptional()
  @IsNumber()
  readonly jobId?: number;

  @IsOptional()
  @IsNumber()
  readonly workId?: number;
}
