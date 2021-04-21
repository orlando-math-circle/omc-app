import { IsOptional, IsString } from 'class-validator';

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  logoutHash?: string;
}
