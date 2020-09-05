import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';
import { EventRecurrenceDto } from './event-recurrence.dto';

export class CreateEventDto {
  @IsString()
  readonly name!: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly picture?: string;

  @IsOptional()
  @IsString()
  readonly color?: string;

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
}
