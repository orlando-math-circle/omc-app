import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';
import { Grade } from '../enums/grade.enum';
import { ReminderFreq } from '../enums/reminder-freq.enum';
import { IndustryDto } from './industry.dto';

export class CreateUserDto {
  @IsString()
  readonly first!: string;

  @IsString()
  readonly last!: string;

  @IsOptional()
  @IsEnum(Grade)
  readonly grade?: Grade;

  @IsEnum(Gender)
  readonly gender!: Gender;

  @IsOptional()
  @IsString()
  readonly email?: string;

  @Type(() => Date)
  @IsDate()
  readonly dob!: Date | string;

  @IsOptional()
  @IsArray()
  @IsEnum(ReminderFreq, { each: true })
  readonly reminders?: ReminderFreq[];

  @IsOptional()
  @Type(() => IndustryDto)
  @ValidateNested()
  industry?: IndustryDto;
}
