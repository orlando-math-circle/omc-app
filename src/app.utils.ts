import _ from 'lodash';
import moment from 'moment';

export type Dict = Record<string, unknown>;

export const isNumber = (fn: any): fn is number => typeof fn === 'number';

export const isString = (fn: any): fn is string => typeof fn === 'string';

export const isSameDay = (dt1: Date, dt2: Date) =>
  moment(dt1).isSame(dt2, 'day');

/**
 * Returns an array contains the keys of object A which
 * are missing or not equal to those in object B.
 *
 * @param a parent object for key retrieval
 * @param b object for comparison
 */
export const diffObject = <A extends Dict, B extends Dict>(
  a: A,
  b: B,
): Partial<A> =>
  _.reduce(
    a,
    (result, value, key) =>
      _.isEqual(value, b[key])
        ? result
        : Object.assign(result, { [key]: value }),
    {},
  );
