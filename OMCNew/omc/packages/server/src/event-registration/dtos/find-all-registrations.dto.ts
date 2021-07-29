import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class FindAllRegistrationsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly offset?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  readonly volunteering?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  readonly coverable?: boolean;
}
