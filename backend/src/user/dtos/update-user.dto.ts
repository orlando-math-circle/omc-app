import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Roles } from '../../app.roles';
import { Grades } from '../enums/grades.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  first?: string;

  @IsOptional()
  @IsString()
  last?: string;

  @IsOptional()
  @IsEnum(Grades)
  gradeSet?: Grades;

  @IsOptional()
  @IsString()
  email?: string;

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
  @IsEnum({ each: true })
  roles?: Roles[];
}
