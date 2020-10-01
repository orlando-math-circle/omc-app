import { QueryOrderMap } from '@mikro-orm/core';
import { IsOptional, IsString } from 'class-validator';

export class SortingDTO {
  @IsOptional()
  @IsString({ each: true })
  sort?: string[];

  /**
   * The above sort is transformed into
   * a query order in the validation pipe.
   *
   * @internal
   */
  orderBy?: QueryOrderMap;
}
