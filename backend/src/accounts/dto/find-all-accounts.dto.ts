import { IsNumberString, IsOptional } from 'class-validator';

export class FindAllAccountsDto {
  @IsOptional()
  @IsNumberString()
  take?: number;

  @IsOptional()
  @IsNumberString()
  skip?: number;
}
