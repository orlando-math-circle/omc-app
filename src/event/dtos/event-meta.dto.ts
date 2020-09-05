import { IsOptional, IsString } from 'class-validator';

export class UpdateEventMetaDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly picture?: string;

  @IsOptional()
  @IsString()
  readonly color?: string;
}
