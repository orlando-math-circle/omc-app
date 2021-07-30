import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class FindAllRegisteredEventsDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly limit?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly offset?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly volunteering?: boolean;
}
