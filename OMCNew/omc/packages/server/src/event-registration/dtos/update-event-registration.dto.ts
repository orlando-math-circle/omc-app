import { IsBoolean } from 'class-validator';

export class UpdateOwnEventRegistrationDto {
  @IsBoolean()
  readonly isCoverable!: boolean;
}
