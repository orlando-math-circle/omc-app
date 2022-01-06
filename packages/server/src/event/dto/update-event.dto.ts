import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RRuleDto } from '.';
import { UpdateEventFeeDto } from '../../event-fee/dto/update-event-fee.dto';
import { UpdateEventMetaDto } from './update-event-meta.dto';

class UpdateTemporalBase {
  @IsString()
  @IsIn(['single', 'recurring'])
  mode!: 'single' | 'recurring';

  @IsOptional()
  @IsDateString()
  dtend?: string;
}

export class UpdateRecurringEventDto extends UpdateTemporalBase {
  mode!: 'recurring';

  @Type(() => RRuleDto)
  @ValidateNested()
  rrule!: RRuleDto;
}

export class UpdateNonRecurringEventDto extends UpdateTemporalBase {
  mode!: 'single';

  @IsDateString()
  dtstart!: string;
}

export class UpdateEventDto {
  /**
   * Starting date and time of the event in ISO 8601 format.
   */
  @IsOptional()
  @IsDateString()
  readonly dtstart?: string;

  /**
   * Ending date and time of the event in ISO 8601 format.
   */
  @IsOptional()
  @IsDateString()
  readonly dtend?: string;

  /**
   * Options for creating an rrule - a descriptive structure that
   * creates a pattern of recurring events based on a set of rules,
   * the `dtstart` and `dtend`, and the `rrule.freq` (frequency) of
   * the recurrence.
   */
  @IsOptional()
  @Type(() => RRuleDto)
  @ValidateNested()
  readonly rrule?: RRuleDto;

  @IsOptional()
  @Type(() => UpdateEventMetaDto)
  @ValidateNested()
  readonly meta?: UpdateEventMetaDto;

  @IsOptional()
  @Type(() => Number)
  readonly courseId?: number;

  @IsOptional()
  @Type(() => Number)
  readonly projectId?: number;

  @IsOptional()
  @Type(() => UpdateEventFeeDto)
  @ValidateNested()
  readonly fee?: UpdateEventFeeDto;
}
