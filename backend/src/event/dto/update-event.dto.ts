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
import { Project } from '../../project/project.entity';
import { EventTimeThreshold } from '../enums/event-time-threshold.enum';
import { EventPermissionsDto } from './event-permissions.dto';
import { EventRecurrenceDto } from './event-recurrence.dto';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  locationTitle?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsOptional()
  @IsString()
  color?: string;

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
  @Type(() => Date)
  @IsDate()
  dtstart?: Date;

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
  @Type(() => EventRecurrenceDto)
  @ValidateNested()
  rrule?: EventRecurrenceDto;
}
