import { IsNumber, IsArray } from 'class-validator';

export class CreateMembershipDto {
  @IsArray()
  @IsNumber({}, { each: true })
  readonly userIds!: number[];
}
