import { IsNumber, IsArray } from 'class-validator';

export class CreateMembershipDto {
  @IsArray()
  @IsNumber({}, { each: true })
  users!: number[];
}
