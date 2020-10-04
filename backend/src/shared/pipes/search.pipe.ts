import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SearchPipe implements PipeTransform {
  transform(value: any, { type }: ArgumentMetadata) {
    if (type !== 'query' || !value.contains) return value;

    // An empty string is synonymous with no search string.
    if (value.contains === '') {
      delete value.contains;
      return value;
    }

    value.contains = value.contains.trim().toLowerCase();

    return value;
  }
}
