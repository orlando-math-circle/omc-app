import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateAccountDto } from '../../account/dtos/create-account.dto';
import { ADULT_AGE } from '../../app.constants';
import { birthdayToAge } from '../../app.utils';
import { CreateUserDto } from '../dto/create-user.dto';
import { Grades } from '../enums/grades.enum';

@Injectable()
export class UserValidationPipe implements PipeTransform {
  transform(
    value: CreateAccountDto | CreateUserDto,
    { type }: ArgumentMetadata,
  ) {
    // Do not perform validation on anything other than the body.
    if (type !== 'body') return value;

    if (!value.grade && value.grade !== 0) {
      // Set graduated on adults who do not specify a grade.
      if (birthdayToAge(value.dob) < ADULT_AGE) {
        throw new BadRequestException('Birthday expected');
      } else {
        value.grade = Grades.GRADUATED;
      }
    }

    return value;
  }
}
