import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ActivityRecordEvent } from '../enums/activity-record-event.enum';
import { ActivityRecordChangeDto } from './activity-record-change.dto';

export class CreateActivityRecordDto {
  @IsEnum(ActivityRecordEvent)
  readonly type!: ActivityRecordEvent;

  @IsOptional()
  @IsString()
  readonly userId?: string;

  @IsOptional()
  @IsString()
  readonly targetId?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ActivityRecordChangeDto)
  readonly changes?: ActivityRecordChangeDto[];
}
