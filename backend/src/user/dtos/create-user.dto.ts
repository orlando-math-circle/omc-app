import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Grades } from '../enums/grades.enum';

export class CreateUserDto {
  @IsString()
  readonly first!: string;

  @IsString()
  readonly last!: string;

  @IsOptional()
  @IsEnum(Grades)
  readonly grade?: Grades;

  @IsOptional()
  @IsString()
  readonly email?: string;

  @Type(() => Date)
  @IsDate()
  readonly dob!: Date | string;
}
