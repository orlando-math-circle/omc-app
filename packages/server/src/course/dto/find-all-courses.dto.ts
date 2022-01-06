import { QueryOrderMap } from '@mikro-orm/core';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindAllCoursesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly offset?: number;

  @IsOptional()
  @IsString()
  readonly contains?: string;

  /**
   * Sort expects properties in the pattern of
   * 'prop:asc' or 'prop:desc'. This is used
   * and transformed internally by the SortingPipe.
   *
   * @internal
   */

  @IsOptional()
  @IsString({ each: true })
  sort?: string[];

  orderBy?: QueryOrderMap;
}
