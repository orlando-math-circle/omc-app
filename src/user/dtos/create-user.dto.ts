import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsDateString()
  dob!: Date;
}
