import { IsString, IsOptional, IsPositive, IsNumber } from 'class-validator';
export class UpdateJobDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsPositive()
  @IsNumber()
  hours?: number;
}
