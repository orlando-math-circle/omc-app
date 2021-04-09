import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateEventFeeDto } from '../../event-fee/dto/create-event-fee.dto';

export class CreateCourseDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  project!: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  events?: number[];

  @IsOptional()
  @Type(() => CreateEventFeeDto)
  @ValidateNested()
  fee?: CreateEventFeeDto;
}
