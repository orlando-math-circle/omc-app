import { Collection, Reference } from '@mikro-orm/core';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ExcludeFunctions<T, K extends keyof T> = T[K] extends Function
  ? never
  : K;

export type Primitive =
  | boolean
  | number
  | string
  | bigint
  | symbol
  | null
  | undefined;

// type Relation<T> = {
//   [P in keyof T as T[P] extends
//     | unknown[]
//     | Record<string | number | symbol, unknown>
//     ? P
//     : never]?: T[P];
// };

export type EntityDTOProp<T> = T extends Primitive
  ? T
  : T extends Date
  ? string
  : T extends Reference<infer U>
  ? EntityDTO<U>
  : T extends Collection<infer U>
  ? EntityDTO<U>[]
  : { [K in keyof T]: EntityDTOProp<T[K]> };

export type EntityDTO<T> = {
  [K in keyof T as ExcludeFunctions<T, K>]: EntityDTOProp<T[K]>;
};
