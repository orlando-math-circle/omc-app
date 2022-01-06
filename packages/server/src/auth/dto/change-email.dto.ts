import { IsEmail } from 'class-validator';

export class ChangeEmailDto {
  @IsEmail()
  readonly email!: string;
}
