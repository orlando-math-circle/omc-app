import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UpdateEventDto } from '../dto';

@Injectable()
export class UpdateEventValidationPipe implements PipeTransform {
  transform(value: UpdateEventDto, { type }: ArgumentMetadata) {
    // Do not perform validation on anything other than the body.
    if (type !== 'body') return value;

    if (
      'dtstart' in value &&
      'dtend' in value &&
      new Date(value.dtstart!) > new Date(value.dtend!)
    ) {
      throw new BadRequestException('dtstart cannot occur after dtend');
    }

    if (
      value.dtstart &&
      value.rrule?.until &&
      new Date(value.dtstart) > new Date(value.rrule.until)
    ) {
      throw new BadRequestException('Start date cannot occur after end date');
    }

    return value;
  }
}
