import { IsObject, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class UpdateAccountDTO {
  @IsOptional()
  @IsDateString()
  logoutAt?: Date;
}
