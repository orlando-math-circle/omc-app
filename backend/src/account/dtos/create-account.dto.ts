import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Grade } from '../../user/enums/grade.enum';

export class CreateAccountDto {
  @IsString()
  email!: string;

  @IsString()
  first!: string;

  @IsString()
  last!: string;

  @IsEnum(Grade)
  @IsOptional()
  grade?: Grade;

  @IsString()
  password!: string;

  @IsDateString()
  dob!: Date;
}
