import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateEventDto } from '../dtos/create-event.dto';

@Injectable()
export class EventValidationPipe implements PipeTransform {
  transform(value: CreateEventDto, { type }: ArgumentMetadata) {
    // Do not perform validation on anything other than the body.
    if (type !== 'body') return value;

    if (value.dtstart && value.dtend && value.dtstart > value.dtend) {
      throw new BadRequestException('Start date cannot occur after end date');
    }

    if (
      value.recurring &&
      value.recurring.dtstart &&
      value.recurring.until &&
      value.recurring.dtstart > value.recurring.until
    ) {
      throw new BadRequestException('Start date cannot occur after end date');
    }

    return value;
  }
}
