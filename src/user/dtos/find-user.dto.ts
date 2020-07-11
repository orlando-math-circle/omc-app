import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindUserDTO {
  @IsNumber()
  @Type(() => Number)
  id: number;
}
