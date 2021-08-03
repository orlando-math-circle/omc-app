import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { VolunteerJob } from '../../volunteer-job/volunteer-job.entity';

export class VolunteerUserJobDto {
  @IsNumber()
  readonly userId!: number;

  @IsOptional()
  @IsNumber()
  readonly job?: number | VolunteerJob;
}

export class CreateVolunteerRegistrationDto {
  @IsNumber()
  @Type(() => Number)
  readonly eventId!: number;

  @IsArray()
  @Type(() => VolunteerUserJobDto)
  @ValidateNested({ each: true })
  readonly users!: VolunteerUserJobDto[];
}
