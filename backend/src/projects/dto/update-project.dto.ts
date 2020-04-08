import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProjectDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hours?: number;
}
