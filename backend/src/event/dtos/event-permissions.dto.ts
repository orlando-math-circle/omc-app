import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

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
  @IsNumber()
  @Min(0) // Kindergarten
  @Max(12) // Twelth Grade
  readonly grade: number;
}
