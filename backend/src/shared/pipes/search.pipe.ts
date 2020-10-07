import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SearchPipe implements PipeTransform {
  transform(value: any, { type }: ArgumentMetadata) {
    if (type !== 'query' || value.contains === undefined) return value;

    // A string with no characters is not a valid search.
    if (!value.contains.trim().length) {
      delete value.contains;
      return value;
    }

    value.contains = value.contains.trim().toLowerCase();

    return value;
  }
}
