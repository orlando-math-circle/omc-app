import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Roles } from '../../app.roles';

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @IsOptional()
  @IsEnum({ each: true })
  roles?: Roles[];
}
