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

export class UpdateEventsDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string | null;

  @IsOptional()
  @IsString()
  readonly locationTitle?: string;

  @IsOptional()
  @IsString()
  readonly location?: string | null;

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
  @IsString()
  readonly picture?: string | null;

  @IsOptional()
  @IsString()
  readonly color?: string | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly dtend?: Date;

  @IsOptional()
  @IsNumber()
  readonly project?: number | Project | null;

  @IsOptional()
  @IsNumber()
  readonly course?: number | Course | null;

  @IsOptional()
  @Type(() => EventRecurrenceDto)
  @ValidateNested()
  readonly rrule?: EventRecurrenceDto;
}
