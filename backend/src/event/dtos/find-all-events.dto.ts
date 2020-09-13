import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class FindAllEventsDto {
  @IsDate()
  @Type(() => Date)
  readonly start: Date;

  @IsDate()
  @Type(() => Date)
  readonly end: Date;
}
