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
import { Roles } from '../../app.roles';
import { Gender } from '../enums/gender.enum';
import { Grade } from '../enums/grade.enum';
import { ReminderFreq } from '../enums/reminder-freq.enum';
import { IndustryDto } from './industry.dto';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  first?: string;

  @IsOptional()
  @IsString()
  last?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dob?: Date | string;

  @IsOptional()
  @IsEnum(Grade)
  grade?: Grade;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  omcEmail?: string;

  @IsOptional()
  @IsBoolean()
  locked?: boolean;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Roles, { each: true })
  roles?: Roles[];

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsArray()
  @IsEnum(ReminderFreq, { each: true })
  reminders?: ReminderFreq[];

  @IsOptional()
  @Type(() => IndustryDto)
  @ValidateNested()
  industry?: IndustryDto;
  
  @IsOptional()
  @IsBoolean()
  readonly volunteer?: boolean;
}
