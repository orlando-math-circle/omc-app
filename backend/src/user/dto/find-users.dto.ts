import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional } from 'class-validator';

export class FindUsersDto {
  @Type(() => Number)
  @IsNumber()
  limit = 20;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsEmail()
  email?: string;
}
