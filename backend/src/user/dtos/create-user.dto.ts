import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Grade } from '../enums/grade.enum';
import { ReminderFreq } from '../enums/reminder-freq.enum';
import { Sex } from '../enums/sex.enum';

export class CreateUserDto {
  @IsString()
  readonly first!: string;

  @IsString()
  readonly last!: string;

  @IsOptional()
  @IsEnum(Grade)
  readonly grade?: Grade;

  @IsEnum(Sex)
  readonly sex!: Sex;

  @IsOptional()
  @IsString()
  readonly email?: string;

  @Type(() => Date)
  @IsDate()
  readonly dob!: Date | string;

  @IsOptional()
  @IsArray()
  @IsEnum(() => ReminderFreq, { each: true })
  readonly reminders?: ReminderFreq[];
}
