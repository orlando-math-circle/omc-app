import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  readonly token!: string;

  @IsString()
  readonly password!: string;
}
