import { VolunteerWorkStatus } from './../enums/work-status.enum';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Project } from './../../project/project.entity';
import { User } from './../../user/user.entity';

export class UpdateWorkDto {
  @IsOptional()
  @IsNumber()
  hours?: number;

  @IsOptional()
  @IsNumber()
  user?: number | User;

  @IsOptional()
  @IsNumber()
  project?: number | Project;

  @IsOptional()
  @IsEnum(VolunteerWorkStatus)
  status?: VolunteerWorkStatus;
}
