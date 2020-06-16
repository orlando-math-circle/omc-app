import { IsNumber } from 'class-validator';

export class FindOneAccountDTO {
  @IsNumber()
  id: number;
}
