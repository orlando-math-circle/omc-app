import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEmailDto {
  @IsArray()
  @IsNumber({}, { each: true })
  userIds: number[];

  @IsString()
  subject!: string;

  @IsString()
  body!: string;

  @IsOptional()
  @IsString()
  from?: string;
}
