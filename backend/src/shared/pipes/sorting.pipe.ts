import { QueryOrder, QueryOrderMap } from '@mikro-orm/core';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

/**
 * Transforms sorting parameters in GET requests into
 * the structure necessary for the `orderBy` option
 * for MikroORM.
 *
 * @example ['name:asc'] is turned into { name: 'ASC' }
 */

@Injectable()
export class SortingPipe implements PipeTransform {
  transform(value: any, { type }: ArgumentMetadata) {
    if (type !== 'query' || !value.sort || !value.sort.length) return value;

    const parameters = Array.isArray(value.sort) ? value.sort : [value.sort];

    const orderBy: QueryOrderMap = {};

    for (const param of parameters) {
      const [attribute, order] = param.split(':');

      const orderType =
        !order || order.toLowerCase() === 'asc'
          ? QueryOrder.ASC
          : QueryOrder.DESC;

      orderBy[attribute] = orderType;
    }

    value.orderBy = orderBy;

    return value;
  }
}
