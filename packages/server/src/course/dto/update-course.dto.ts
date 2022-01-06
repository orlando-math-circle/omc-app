import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsNumber()
  readonly project?: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  readonly events?: number[];
}
