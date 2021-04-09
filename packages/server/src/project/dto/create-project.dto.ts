import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateJobDto } from '../../volunteer-job/dto/create-job.dto';

export class CreateProjectDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateJobDto)
  jobs?: CreateJobDto[];
}
