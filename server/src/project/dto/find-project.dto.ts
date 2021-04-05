import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindProjectDto {
  @Type(() => Number)
  @IsNumber()
  id!: number;
}
