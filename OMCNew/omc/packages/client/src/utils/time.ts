/**
 * Calculates the number of days in a month.
 *
 * @param month Month of the year from 0 to 11.
 * @param year Year.
 */
export const daysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate()
}
