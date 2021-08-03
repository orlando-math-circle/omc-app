import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindOneAccountDto {
  @IsNumber()
  @Type(() => Number)
  id!: number;
}
