import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Grades } from '../enums/grades.enum';

export class CreateUserDto {
  @IsString()
  first!: string;

  @IsString()
  last!: string;

  @IsOptional()
  @IsEnum(Grades)
  grade?: Grades;

  @IsOptional()
  @IsString()
  email?: string;

  @IsDateString()
  dob!: Date;
}
