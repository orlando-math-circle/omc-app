import { Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

export class CreateRegistrationDto {
  @IsNumber()
  @Type(() => Number)
  eventId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  users: number[];
}
