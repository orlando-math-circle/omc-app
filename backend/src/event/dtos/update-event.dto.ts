import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Course } from '../../course/course.entity';
import { Project } from '../../project/project.entity';
import { EventRecurrenceDto } from './event-recurrence.dto';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dtstart?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dtend?: Date;

  @IsOptional()
  @IsNumber()
  project?: number | Project;

  @IsOptional()
  @IsNumber()
  course?: number | Course;

  @IsOptional()
  @Type(() => EventRecurrenceDto)
  @ValidateNested()
  rrule?: EventRecurrenceDto;
}
