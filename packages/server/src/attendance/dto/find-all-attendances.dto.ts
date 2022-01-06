import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindAllAttendancesDto {
  @IsOptional()
  @IsNumber()
  readonly limit?: number;

  @IsOptional()
  @IsNumber()
  readonly offset?: number;

  @IsOptional()
  @IsNumber()
  readonly user?: number;

  @IsOptional()
  @IsNumber()
  readonly event?: number;

  @IsOptional()
  @IsString()
  readonly contains?: string;
}
