import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UpdateEventDto } from '../dto/update-event.dto';
import { UpdateEventsDto } from '../dto/update-events.dto';

@Injectable()
export class UpdateEventValidationPipe implements PipeTransform {
  transform(
    value: UpdateEventDto | UpdateEventsDto,
    { type }: ArgumentMetadata,
  ) {
    // Do not perform validation on anything other than the body.
    if (type !== 'body') return value;

    if ('dtstart' in value && value.rrule) {
      throw new BadRequestException(
        'dtstart is only provided for non-recurring events',
      );
    }

    if ('dtstart' in value && 'dtend' in value && value.dtstart > value.dtend) {
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

    // Must have both feeType and fee when adding or updating a fee.
    if (!!value.feeType !== !!value.fee) {
      throw new BadRequestException('Malformed fee mutation');
    }

    return value;
  }
}
