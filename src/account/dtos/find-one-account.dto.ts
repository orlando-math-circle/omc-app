import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindOneAccountDTO {
  @IsNumber()
  @Type(() => Number)
  id: number;
}
