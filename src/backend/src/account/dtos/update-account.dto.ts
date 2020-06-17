import { IsDateString, IsOptional } from 'class-validator';

export class UpdateAccountDTO {
  @IsOptional()
  @IsDateString()
  logoutAt?: Date;
}
