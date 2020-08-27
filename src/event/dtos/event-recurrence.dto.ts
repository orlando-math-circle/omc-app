import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ByWeekday, Frequency, Options, Weekday } from 'rrule';

export class EventRecurrenceDto implements Partial<Options> {
  @IsEnum(Frequency)
  readonly freq!: Frequency;

  @Type(() => Date)
  @IsDate()
  readonly dtstart!: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly until?: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly interval?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  count?: number;

  @IsOptional()
  @IsString()
  readonly wkst?: Weekday | number;

  @IsOptional()
  @IsNumber(null, { each: true })
  readonly bysetpos?: number | number[];

  @IsOptional()
  @IsNumber(null, { each: true })
  readonly bymonth?: number | number[];

  @IsOptional()
  @IsNumber(null, { each: true })
  readonly bymonthday?: number | number[];

  @IsOptional()
  @IsArray()
  @IsNumber(null, { each: true })
  readonly bynmonthday?: number[];

  @IsOptional()
  @IsNumber(null, { each: true })
  readonly byyearday?: number | number[];

  @IsOptional()
  @IsNumber(null, { each: true })
  readonly byweekno?: number | number[];

  @IsOptional()
  @IsNumber(null, { each: true })
  readonly byweekday?: ByWeekday | ByWeekday[];

  @IsOptional()
  @IsNumber(null, { each: true })
  readonly bynweekday?: number[][];

  @IsOptional()
  @IsNumber(null, { each: true })
  readonly byhour?: number | number[];

  @IsOptional()
  @IsNumber(null, { each: true })
  readonly byminute?: number | number[];

  @IsOptional()
  @IsNumber(null, { each: true })
  readonly bysecond?: number | number[];
}
