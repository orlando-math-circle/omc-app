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
  readonly name!: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly location?: string;

  @IsOptional()
  @IsString()
  readonly locationTitle?: string = 'Online';

  @IsOptional()
  @IsString()
  readonly picture?: string;

  @IsOptional()
  @IsString()
  readonly color?: string;

  @IsOptional()
  @Type(() => EventPermissionsDto)
  @ValidateNested()
  readonly permissions?: EventPermissionsDto;

  @IsOptional()
  @IsEnum(EventTimeThreshold)
  readonly cutoffThreshold?: EventTimeThreshold;

  @IsOptional()
  @IsNumber()
  readonly cutoffOffset?: number;

  @IsOptional()
  @IsEnum(EventTimeThreshold)
  readonly lateThreshold?: EventTimeThreshold;

  @IsOptional()
  @IsNumber()
  readonly lateOffset?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly dtstart?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly dtend?: Date;

  @IsOptional()
  @Type(() => EventRecurrenceDto)
  @ValidateNested()
  readonly rrule?: EventRecurrenceDto;

  @IsOptional()
  @Type(() => CreateEventFeeDto)
  @ValidateNested()
  readonly fee?: CreateEventFeeDto;

  @IsOptional()
  @IsEnum(FeeType)
  readonly feeType?: FeeType;

  @IsOptional()
  @Type(() => Number)
  readonly course?: number;

  @IsOptional()
  @Type(() => Number)
  readonly project?: number;
}
