import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EventPermissionsDto } from '.';
import { EventTimeThreshold } from '../enums/event-time-threshold.enum';

export class UpdateEventMetaDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly location?: string;

  @IsOptional()
  @IsString()
  readonly locationTitle?: string;

  @IsOptional()
  @IsNumber()
  readonly points?: number;

  @IsOptional()
  @Type(() => EventPermissionsDto)
  @ValidateNested()
  readonly permissions?: EventPermissionsDto;

  @IsOptional()
  @IsEnum(EventTimeThreshold)
  readonly cutoffThreshold?: EventTimeThreshold;

  @IsOptional()
  @IsNumber()
  readonly cutoffOffset?: number;

  @IsOptional()
  @IsEnum(EventTimeThreshold)
  readonly lateThreshold?: EventTimeThreshold;

  @IsOptional()
  @IsNumber()
  readonly lateOffset?: number;
}
