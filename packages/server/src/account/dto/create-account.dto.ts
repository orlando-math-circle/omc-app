import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Roles } from '../../app.roles';
import { IndustryDto } from '../../user/dto/industry.dto';
import { Gender } from '../../user/enums/gender.enum';
import { Grade } from '../../user/enums/grade.enum';
import { ReminderFreq } from '../../user/enums/reminder-freq.enum';

export class CreateAccountDto {
  @IsString()
  readonly email!: string;

  @IsOptional()
  @IsString()
  readonly omcEmail?: string;

  @IsOptional()
  @IsBoolean()
  readonly emailVerified?: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(Roles, { each: true })
  readonly roles?: Roles[];

  @IsOptional()
  @IsBoolean()
  readonly feeWaived?: boolean;

  @IsString()
  readonly first!: string;

  @IsString()
  readonly last!: string;

  @IsEnum(Grade)
  @IsOptional()
  readonly grade?: Grade;

  @IsEnum(Gender)
  readonly gender!: Gender;

  @IsString()
  readonly password!: string;

  @IsDateString()
  readonly dob!: string;

  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(ReminderFreq, { each: true })
  readonly reminders?: ReminderFreq[];

  @IsOptional()
  @Type(() => IndustryDto)
  @ValidateNested()
  industry?: IndustryDto;
}
