import { Type } from 'class-transformer';
import { ManyToOne } from '@mikro-orm/core';
import { User } from '@server/user/user.entity';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { AuditChange } from '../interfaces/audit-change.interface';
import { AuditType } from '../enums/audit-type.enum';

export class AuditLogDto {
  @IsNumber()
  userId!: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  changes!: AuditChange[];

  user!: User;

  type!: AuditType;

  @IsString()
  target_id!: string;
}
