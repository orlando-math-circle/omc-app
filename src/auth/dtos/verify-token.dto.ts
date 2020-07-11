import { IsString } from 'class-validator';

export class VerifyTokenDto {
  @IsString()
  token: string;
}
