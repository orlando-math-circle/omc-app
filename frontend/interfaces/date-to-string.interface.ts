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

/**
 * Used to change the native types from the backend entities
 * into their JSON versions without having to define new interfaces.
 */
export type DTO<T> = {
  [key in keyof T]: DateToString<T[key]>
}
