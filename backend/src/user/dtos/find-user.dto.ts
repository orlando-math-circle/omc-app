import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindUserDto {
  @IsNumber()
  @Type(() => Number)
  id: number;
}
