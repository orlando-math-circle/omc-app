import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateFileFieldDto {
  @IsString()
  name!: string;

  @IsNumber()
  fileSizeLimit!: number;

  @IsNumber()
  fileCountLimit!: number;

  @IsArray()
  @IsString({ each: true })
  fileExtensions!: string[];
}
