import { IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber({}, { each: true })
  users: number[];
}
