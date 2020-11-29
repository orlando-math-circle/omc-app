import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from '../../user/enums/gender.enum';
import { Grade } from '../../user/enums/grade.enum';

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

  @IsEnum(Gender)
  readonly gender!: Gender;

  @IsString()
  readonly password!: string;

  @IsDateString()
  readonly dob!: Date;
}
