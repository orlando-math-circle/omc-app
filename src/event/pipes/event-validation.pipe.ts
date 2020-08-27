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

    if (value.dtstart && value.rrule) {
      throw new BadRequestException(
        'Start date is only provided for non-recurring events',
      );
    }

    if (value.dtstart && value.dtend && value.dtstart > value.dtend) {
      throw new BadRequestException('Start date cannot occur after end date');
    }

    if (
      value.rrule &&
      value.rrule.dtstart &&
      value.rrule.until &&
      value.rrule.dtstart > value.rrule.until
    ) {
      throw new BadRequestException('Start date cannot occur after end date');
    }

    if (!value.dtstart && !value.rrule) {
      throw new BadRequestException(
        'Cannot create event no rrule or starting date',
      );
    }

    return value;
  }
}
