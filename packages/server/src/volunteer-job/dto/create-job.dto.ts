import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateJobDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Min(0)
  @IsNumber()
  hours?: number;

  @IsOptional()
  @IsNumber()
  project?: number;
}
