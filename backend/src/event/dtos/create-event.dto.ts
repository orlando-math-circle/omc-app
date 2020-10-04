import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { EventRecurrenceDto } from './event-recurrence.dto';

export class CreateEventDto {
  @IsString()
  readonly name!: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsBoolean()
  readonly isOnline: boolean = false;

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
