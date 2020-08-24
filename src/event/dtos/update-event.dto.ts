import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { UpdateEventMetaDto } from './event-meta.dto';
import { EventRecurrenceDto } from './event-recurrence.dto';

export class UpdateEventDto {
  @IsOptional()
  @Type(() => UpdateEventMetaDto)
  @ValidateNested()
  readonly meta?: UpdateEventMetaDto;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly dtstart?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly dtend?: Date;

  /**
   * Duration of the event, 0 to 1440 (minutes in a day).
   * TODO: More concise validation logic here, e.g. add an all-day attribute.
   */

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1440)
  readonly duration?: number;

  @IsOptional()
  @Type(() => EventRecurrenceDto)
  @ValidateNested()
  readonly rrule?: EventRecurrenceDto;
}
