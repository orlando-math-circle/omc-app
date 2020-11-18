import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Grade } from '../enums/grade.enum';

export class CreateUserDto {
  @IsString()
  readonly first!: string;

  @IsString()
  readonly last!: string;

  @IsOptional()
  @IsEnum(Grade)
  readonly grade?: Grade;

  @IsOptional()
  @IsString()
  readonly email?: string;

  @Type(() => Date)
  @IsDate()
  readonly dob!: Date | string;
}
