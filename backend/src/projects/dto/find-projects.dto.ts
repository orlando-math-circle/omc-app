import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FindProjectsDTO {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip?: number;
}
