import { IsOptional, IsString } from 'class-validator';

export class UpdateAccountDTO {
  @IsOptional()
  @IsString()
  logoutHash?: string;
}
