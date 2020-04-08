import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FindProjectDTO {
  @IsNumber()
  @Type(() => Number)
  id: number;
}
