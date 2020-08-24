import { Type } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

export class FindEventInstanceDto {
  @IsNumber()
  readonly parentId!: number;

  @IsDate()
  @Type(() => Date)
  readonly start!: Date;
}
