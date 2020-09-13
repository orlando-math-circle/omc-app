import { IsString } from 'class-validator';

export class CreateRegistrationDto {
  @IsString()
  readonly invoiceId!: string;
}
