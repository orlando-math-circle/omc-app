import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindAllEventsDto {
  @IsDate()
  @Type(() => Date)
  readonly start: Date;

  @IsDate()
  @Type(() => Date)
  readonly end: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  readonly projects?: number[] | number;

  @IsOptional()
  @IsString()
  contains?: string;
}
