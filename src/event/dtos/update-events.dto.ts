import { Type } from 'class-transformer';
import { IsDate, IsOptional, ValidateNested } from 'class-validator';
import { UpdateEventMetaDto } from './event-meta.dto';
import { EventRecurrenceDto } from './event-recurrence.dto';

export class UpdateEventsDto {
  @IsOptional()
  @Type(() => UpdateEventMetaDto)
  @ValidateNested()
  readonly meta?: UpdateEventMetaDto;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly dtend?: Date;

  @IsOptional()
  @Type(() => EventRecurrenceDto)
  @ValidateNested()
  readonly rrule?: EventRecurrenceDto;
}
