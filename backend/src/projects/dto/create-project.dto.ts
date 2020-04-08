import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateProjectDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hours?: number;
}
