/**
 * Change the type of keys of T to NewType
 */
export type ChangeTypeOfKeys<T extends object, Keys extends keyof T, Type> = {
  [key in keyof T]: key extends Keys ? Type : T[key]
}

/**
 * Changes any date types found in an object to string types.
 */
export type DateToString<T> = T extends Date ? string : T

export type Replace<T, TReplace, TWith> = T extends TReplace
  ? T extends TReplace
    ? TWith
    : T
  : {
      [P in keyof T]: Replace<T[P], TReplace, TWith>
    }

/**
 * Used to change the native types from the backend entities
 * into their JSON versions without having to define new interfaces.
 */
export type DTO<T> = Replace<T, Date, string>
