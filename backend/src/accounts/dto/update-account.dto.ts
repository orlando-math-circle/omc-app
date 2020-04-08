import { IsEmail, IsOptional } from 'class-validator';

export class UpdateAccountDto {
  @IsOptional()
  @IsEmail()
  email?: string;
}
