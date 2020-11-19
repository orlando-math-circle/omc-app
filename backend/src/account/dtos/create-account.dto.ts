import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Grade } from '../../user/enums/grade.enum';
import { Sex } from '../../user/enums/sex.enum';

export class CreateAccountDto {
  @IsString()
  readonly email!: string;

  @IsString()
  readonly first!: string;

  @IsString()
  readonly last!: string;

  @IsEnum(Grade)
  @IsOptional()
  readonly grade?: Grade;

  @IsEnum(Sex)
  readonly sex!: Sex;

  @IsString()
  readonly password!: string;

  @IsDateString()
  readonly dob!: Date;
}
