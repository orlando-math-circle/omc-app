import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Grades } from '../../user/enums/grades.enum';

export class CreateAccountDto {
  @IsString()
  email!: string;

  @IsString()
  first!: string;

  @IsString()
  last!: string;

  @IsEnum(Grades)
  @IsOptional()
  grade?: Grades;

  @IsString()
  password!: string;

  @IsDateString()
  dob!: Date;
}
