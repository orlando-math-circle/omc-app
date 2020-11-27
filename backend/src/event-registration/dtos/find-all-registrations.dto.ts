import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FindAllRegistrationsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly offset?: number;
}
