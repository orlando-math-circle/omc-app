import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Course } from '../../course/course.entity';
import { CreateEventFeeDto } from '../../event-fee/dto/create-event-fee.dto';
import { Project } from '../../project/project.entity';
import { EventTimeThreshold } from '../enums/event-time-threshold.enum';
import { FeeType } from '../enums/fee-type.enum';
import { EventPermissionsDto } from './event-permissions.dto';
import { EventRecurrenceDto } from './event-recurrence.dto';

export class UpdateEventsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  locationTitle?: string;

  @IsOptional()
  @IsString()
  location?: string | null;

  @IsOptional()
  @Type(() => EventPermissionsDto)
  @ValidateNested()
  permissions?: EventPermissionsDto;

  @IsOptional()
  @IsEnum(EventTimeThreshold)
  cutoffThreshold?: EventTimeThreshold;

  @IsOptional()
  @IsNumber()
  cutoffOffset?: number;

  @IsOptional()
  @IsEnum(EventTimeThreshold)
  lateThreshold?: EventTimeThreshold;

  @IsOptional()
  @IsNumber()
  lateOffset?: number;

  @IsOptional()
  @IsString()
  picture?: string | null;

  @IsOptional()
  @IsString()
  color?: string | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dtend?: Date;

  @IsOptional()
  @IsNumber()
  project?: number | Project | null;

  @IsOptional()
  @IsNumber()
  course?: number | Course | null;

  @IsOptional()
  @IsEnum(FeeType)
  feeType?: FeeType;

  @IsOptional()
  @Type(() => CreateEventFeeDto)
  @ValidateNested()
  fee?: CreateEventFeeDto;

  @IsOptional()
  @Type(() => EventRecurrenceDto)
  @ValidateNested()
  rrule?: EventRecurrenceDto;
}
