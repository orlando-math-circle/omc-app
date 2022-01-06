import { IsString } from 'class-validator';

export class VerifyTokenDto {
  @IsString()
  readonly token!: string;
}
