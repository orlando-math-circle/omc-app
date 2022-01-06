import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DefaultAvatar } from '../enums/default-avatar.enum';
import { Gender } from '../enums/gender.enum';
import { Grade } from '../enums/grade.enum';
import { ReminderFreq } from '../enums/reminder-freq.enum';
import { IndustryDto } from './industry.dto';

export class UpdateOwnUserDto {
  @IsOptional()
  @IsString()
  readonly first?: string;

  @IsOptional()
  @IsString()
  readonly last?: string;

  @IsOptional()
  @IsEnum(DefaultAvatar)
  avatar?: DefaultAvatar;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly dob?: Date | string;

  @IsOptional()
  @IsEnum(Grade)
  readonly grade?: Grade;

  @IsOptional()
  @IsEnum(Gender)
  readonly gender?: Gender;

  @IsOptional()
  @IsArray()
  @IsEnum(ReminderFreq, { each: true })
  readonly reminders?: ReminderFreq[];

  @IsOptional()
  @Type(() => IndustryDto)
  @ValidateNested()
  industry?: IndustryDto;

  @IsOptional()
  @IsBoolean()
  volunteer = true;
}
