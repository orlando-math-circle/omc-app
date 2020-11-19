import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { Grade } from '../../user/enums/grade.enum';
import { Sex } from '../../user/enums/sex.enum';

export class EventPermissionsDto {
  @IsOptional()
  @IsArray()
  @IsEnum(Grade, { each: true })
  readonly grades?: Grade[];

  @IsOptional()
  @IsArray()
  @IsEnum(Sex, { each: true })
  readonly sexes?: Sex[];
}
