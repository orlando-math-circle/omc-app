import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Grade } from '../../user/enums/grade.enum';
import { Sex } from '../../user/enums/sex.enum';

export class EventAgePermissionsDto {
  @IsNumber()
  readonly min!: number;

  @IsNumber()
  readonly max!: number;
}

export class EventPermissionsDto {
  @IsOptional()
  @Type(() => EventAgePermissionsDto)
  @ValidateNested()
  readonly age: EventAgePermissionsDto;

  @IsOptional()
  @IsEnum(Grade)
  readonly grade: Grade;

  @IsOptional()
  @IsEnum(Sex)
  readonly sex: Sex;
}
