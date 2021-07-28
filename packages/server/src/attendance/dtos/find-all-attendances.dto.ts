import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindAllAttendancesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  user?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  event?: number;

  @IsOptional()
  @IsString()
  contains?: string;
}

/*
import { QueryOrderMap } from '@mikro-orm/core';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Roles } from '../../app.roles';
import { Grade } from '../enums/grade.enum';

export class FindUsersDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Type(() => Number)
  @IsEnum(Grade, { each: true })
  grade?: Grade | Grade[];

  @IsOptional()
  @IsEnum(Roles, { each: true })
  role?: Roles | Roles[];

  @IsOptional()
  @IsString()
  contains?: string;

  /**
   * Sort expects properties in the pattern of
   * 'prop:asc' or 'prop:desc'. This is used
   * and transformed internally by the SortingPipe.
   *
   * @internal
   

  @IsOptional()
  @IsString({ each: true })
  sort?: string[];

  orderBy?: QueryOrderMap;
}
*/
