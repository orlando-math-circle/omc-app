import { IsDateString, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  email!: string;

  @IsString()
  first!: string;

  @IsString()
  last!: string;

  @IsString()
  password!: string;

  @IsDateString()
  dob!: Date;
}
