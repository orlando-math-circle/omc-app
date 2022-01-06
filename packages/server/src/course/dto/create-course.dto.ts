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
  readonly name!: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsNumber()
  readonly project!: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  readonly events?: number[];

  @IsOptional()
  @Type(() => CreateEventFeeDto)
  @ValidateNested()
  readonly fee?: CreateEventFeeDto;
}
