import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EventPermissionsDto, RRuleDto } from '.';
import { CreateEventFeeDto } from '../..';
import { CreateEventMetaDto } from './create-event-meta.dto';

class TemportalBaseDto {
  @IsString()
  @IsIn(['single', 'recurring'])
  readonly mode!: 'single' | 'recurring';

  @IsDateString()
  dtend!: string;
}

export class RecurringTemporalDto extends TemportalBaseDto {
  readonly mode!: 'recurring';

  @Type(() => RRuleDto)
  @ValidateNested()
  rrule!: RRuleDto;
}

export class NonRecurringTemportalDto extends TemportalBaseDto {
  readonly mode!: 'single';

  @IsDateString()
  dtstart!: string;
}

export class CreateEventDto {
  @ValidateNested()
  @Type(() => TemportalBaseDto, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'mode',
      subTypes: [
        { value: RecurringTemporalDto, name: 'recurring' },
        { value: NonRecurringTemportalDto, name: 'single' },
      ],
    },
  })
  temporal!: RecurringTemporalDto | NonRecurringTemportalDto;

  @Type(() => EventPermissionsDto)
  @ValidateNested()
  metadata!: CreateEventMetaDto;

  @IsOptional()
  @Type(() => Number)
  courseId?: number;

  @IsOptional()
  @Type(() => Number)
  projectId?: number;

  @IsOptional()
  @Type(() => CreateEventFeeDto)
  @ValidateNested()
  fee?: CreateEventFeeDto;
}
