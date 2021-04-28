import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IndustryDto } from '../../user/dtos/industry.dto';
import { Gender } from '../../user/enums/gender.enum';
import { Grade } from '../../user/enums/grade.enum';
import { ReminderFreq } from '../../user/enums/reminder-freq.enum';

export class RegisterAccountDto {
  @IsString()
  readonly email!: string;

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
  readonly dob!: Date;

  @IsOptional()
  @IsArray()
  @IsEnum(ReminderFreq, { each: true })
  readonly reminders?: ReminderFreq[];

  @IsOptional()
  @Type(() => IndustryDto)
  @ValidateNested()
  industry?: IndustryDto;
}
