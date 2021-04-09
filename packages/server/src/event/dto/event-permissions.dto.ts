import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { Grade } from '../../user/enums/grade.enum';
import { Gender } from '../../user/enums/gender.enum';

export class EventPermissionsDto {
  @IsOptional()
  @IsArray()
  @IsEnum(Grade, { each: true })
  readonly grades?: Grade[];

  @IsOptional()
  @IsArray()
  @IsEnum(Gender, { each: true })
  readonly genders?: Gender[];
}
