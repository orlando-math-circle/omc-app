import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  readonly curPassword!: string;

  @IsString()
  readonly newPassword!: string;
}
