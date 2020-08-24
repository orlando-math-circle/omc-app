import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { UpdateEventMetaDto } from './event-meta.dto';
import { EventRecurrenceDto } from './event-recurrence.dto';

export class UpdateEventsDto {
  @IsOptional()
  @Type(() => UpdateEventMetaDto)
  @ValidateNested()
  readonly meta?: UpdateEventMetaDto;

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
