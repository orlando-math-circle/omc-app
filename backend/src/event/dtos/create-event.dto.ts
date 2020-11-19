import { Type } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
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
  readonly picture?: string;

  @IsOptional()
  @IsString()
  readonly color?: string;

  @IsOptional()
  @IsString()
  @Matches(/^((-?[0-9]+)|(-?([0-9]+)?[.][0-9]+))$/)
  readonly fee?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly dtstart?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly dtend?: Date;

  @IsOptional()
  @Type(() => EventPermissionsDto)
  @ValidateNested()
  readonly permissions?: EventPermissionsDto;

  /**
   * Recurring Events
   */

  @IsOptional()
  @Type(() => EventRecurrenceDto)
  @ValidateNested()
  readonly rrule?: EventRecurrenceDto;

  /**
   * Course
   */

  @IsOptional()
  @Type(() => Number)
  readonly course?: number;

  /**
   * Project
   */

  @IsOptional()
  @Type(() => Number)
  readonly project?: number;
}
