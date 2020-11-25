import { ArrayMinSize, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  users: number[];
}
