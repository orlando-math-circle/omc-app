import { IsEmail, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
