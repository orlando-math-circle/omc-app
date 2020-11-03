import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsPositive()
  @IsNumber()
  hours?: number;

  @IsNumber()
  project!: number;
}
