import { IsNumber } from 'class-validator';

export class UpdateEventInstanceDto {
  @IsNumber()
  readonly parentId!: number;
}
