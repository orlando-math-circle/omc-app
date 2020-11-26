import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { DefaultAvatar } from '../enums/default-avatar.enum';
import { Grade } from '../enums/grade.enum';

export class UpdateOwnUserDto {
  @IsOptional()
  @IsString()
  first?: string;

  @IsOptional()
  @IsString()
  last?: string;

  @IsOptional()
  @IsEnum(DefaultAvatar)
  avatar?: DefaultAvatar;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dob?: Date | string;

  @IsOptional()
  @IsEnum(Grade)
  grade?: Grade;
}
