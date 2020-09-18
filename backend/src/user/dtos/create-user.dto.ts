import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  first!: string;

  @IsString()
  last!: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsDateString()
  dob!: Date;
}
