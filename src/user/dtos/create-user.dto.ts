import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsDateString()
  dob!: Date;
}
