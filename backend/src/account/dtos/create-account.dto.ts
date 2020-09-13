import { IsDateString, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  email!: string;

  @IsString()
  name!: string;

  @IsString()
  password!: string;

  @IsDateString()
  dob!: Date;
}
