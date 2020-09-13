import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';
import { EventRecurrenceDto } from './event-recurrence.dto';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

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
  @Type(() => Date)
  @IsDate()
  readonly dtstart?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly dtend?: Date;

  @IsOptional()
  @Type(() => EventRecurrenceDto)
  @ValidateNested()
  readonly rrule?: EventRecurrenceDto;
}
