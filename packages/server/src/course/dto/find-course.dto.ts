import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindCourseDto {
  @Type(() => Number)
  @IsNumber()
  readonly id!: number;
}
