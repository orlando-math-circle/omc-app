import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { SortingDTO } from '../../shared/dto/sorting.dto';

export class FindAllProjectsDto extends SortingDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsString({ each: true })
  sortASC: string[];

  @IsOptional()
  @IsString({ each: true })
  sortDESC: string[];
}
