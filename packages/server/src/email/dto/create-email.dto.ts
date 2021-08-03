import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateEmailDto {
  @IsArray()
  @IsEmail({}, { each: true })
  emails!: string[];

  @IsString()
  subject!: string;

  @IsString()
  html!: string;

  @IsString()
  text!: string;

  @IsOptional()
  @IsString()
  from?: string;
}
