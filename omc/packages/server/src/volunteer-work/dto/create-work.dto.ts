import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Project } from '../../project/project.entity';
import { User } from '../../user/user.entity';
import { VolunteerWorkStatus } from './../enums/work-status.enum';

export class CreateWorkDto {
  @IsNumber()
  hours!: number;

  @IsNumber()
  user!: number | User;

  @IsOptional()
  @IsNumber()
  project?: number | Project;

  @IsEnum(VolunteerWorkStatus)
  status!: VolunteerWorkStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
