import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateEventDto } from '../dto/create-event-old.dto';

@Injectable()
export class CreateEventValidationPipe implements PipeTransform {
  transform(value: CreateEventDto, { type }: ArgumentMetadata) {
    // Do not perform validation on anything other than the body.
    if (type !== 'body') return value;

    if (value.dtstart && value.rrule) {
      throw new BadRequestException(
        'dtstart is only provided for non-recurring events',
      );
    }

    if (value.dtstart && value.dtend && value.dtstart > value.dtend) {
      throw new BadRequestException('dtstart cannot occur after dtend');
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

    // Must have both feeType and fee when adding or updating a fee.
    if (!!value.feeType !== !!value.fee) {
      throw new BadRequestException('Malformed fee mutation');
    }

    return value;
  }
}
