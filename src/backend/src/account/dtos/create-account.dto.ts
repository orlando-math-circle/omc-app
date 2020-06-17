import { IsDateString, IsString } from 'class-validator';

export class CreateAccountDTO {
  @IsString()
  email!: string;

  @IsString()
  name!: string;

  @IsString()
  password!: string;

  @IsDateString()
  dob!: Date;
}
