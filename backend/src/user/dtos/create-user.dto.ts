import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Grade } from '../enums/grade.enum';
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
}
