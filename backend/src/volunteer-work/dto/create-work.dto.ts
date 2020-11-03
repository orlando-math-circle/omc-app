import { IsNumber } from 'class-validator';
import { Project } from '../../project/project.entity';
import { User } from '../../user/user.entity';

export class CreateWorkDto {
  @IsNumber()
  hours!: number;

  @IsNumber()
  user!: number | User;

  @IsNumber()
  project?: number | Project;
}
