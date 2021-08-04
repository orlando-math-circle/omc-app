import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateEventFeeDto } from '../../event-fee/dto/create-event-fee.dto';
import { EventTimeThreshold } from '../enums/event-time-threshold.enum';
import { FeeType } from '../enums/fee-type.enum';
import { EventPermissionsDto } from './event-permissions.dto';
import { EventRecurrenceDto } from './event-recurrence.dto';

export class CreateEventDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  locationTitle?: string = 'Online';

  @IsOptional()
  @IsString()
  picture?: string;

  @IsOptional()
  @IsString()
  color?: string;

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
  @IsDate()
  @Type(() => Date)
  dtstart?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dtend?: Date;

  @IsOptional()
  @Type(() => EventRecurrenceDto)
  @ValidateNested()
  rrule?: EventRecurrenceDto;

  @IsOptional()
  @IsEnum(FeeType)
  feeType?: FeeType;

  @IsOptional()
  @Type(() => CreateEventFeeDto)
  @ValidateNested()
  fee?: CreateEventFeeDto;

  @IsOptional()
  @Type(() => Number)
  course?: number;

  @IsOptional()
  @Type(() => Number)
  project?: number;

  @IsOptional()
  @Type(() => Number)
  points?: number;
}
