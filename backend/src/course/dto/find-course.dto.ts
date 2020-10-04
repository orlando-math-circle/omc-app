import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindCourseDto {
  @Type(() => Number)
  @IsNumber()
  id!: number;
}
