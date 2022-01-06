export const isNumber = (value: any): value is number =>
  typeof value === 'number'

export const isString = (value: any): value is string =>
  typeof value === 'string'

export const isArray = (value: any): value is any[] => Array.isArray(value)

export const isDate = (value: any): value is Date => value instanceof Date
