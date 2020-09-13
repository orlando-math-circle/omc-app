import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindEventDto {
  @IsNumber()
  @Type(() => Number)
  readonly id!: number;
}
