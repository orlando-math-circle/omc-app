import { IsString } from 'class-validator';

export class VerifyTokenDTO {
  @IsString()
  token: string;
}
