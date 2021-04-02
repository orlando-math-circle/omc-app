import { Grade } from '@omc/server/user/enums/grade.enum'
import { Frequency, Options } from 'rrule'

export const grades = Object.freeze([
  { text: 'Kindergarten', short: 'K', value: Grade.KINDERGARTEN },
  { text: '1st Grade', short: '1st', value: Grade.FIRST },
  { text: '2nd Grade', short: '2nd', value: Grade.SECOND },
  { text: '3rd Grade', short: '3rd', value: Grade.THIRD },
  { text: '4th Grade', short: '4th', value: Grade.FOURTH },
  { text: '5th Grade', short: '5th', value: Grade.FIFTH },
  { text: '6th Grade', short: '6th', value: Grade.SIXTH },
  { text: '7th Grade', short: '7th', value: Grade.SEVENTH },
  { text: '8th Grade', short: '8th', value: Grade.EIGHTH },
  { text: '9th Grade', short: '9th', value: Grade.NINTH },
  { text: '10th Grade', short: '10th', value: Grade.TENTH },
  { text: '11th Grade', short: '11th', value: Grade.ELEVENTH },
  { text: '12th Grade', short: '12th', value: Grade.TWELFTH },
  { text: 'Graduated', short: 'G', value: Grade.GRADUATED },
  { text: 'Undergraduate', short: 'UG', value: Grade.UNDERGRADUATE },
  { text: 'Postgraduate', short: 'PG', value: Grade.POSTGRADUATE },
])

export const contiguousGradeRanges = (grades: Grade[]) => {
  const levels = [...grades].sort((a, b) => a - b)
  const ranges: Grade[][] = []

  for (let i = 0, j = 0; i < levels.length; i++) {
    if (!ranges[j]) {
      ranges[j] = [levels[i]]
    } else if (levels[i] === levels[i - 1] + 1) {
      ranges[j].push(levels[i])
    } else {
      ranges[++j] = [levels[i]]
    }
  }

  return ranges
}

export const gradeGroups = (ranges: Grade[][]) => {
  const chips = []

  for (const range of ranges) {
    switch (range.length) {
      case 0:
        break
      case 1:
        chips.push(grades[range[0]].text)
        break
      default:
        chips.push(
          `${grades[range[0]].short} - ${grades[range[range.length - 1]].text}`
        )
        break
    }
  }

  return chips
}

export const parseRRule = (options: Partial<Options>) => {
  const retval: Partial<Options> = {
    freq: options.freq,
    dtstart: options.dtstart,
  }

  switch (options.freq) {
    case Frequency.WEEKLY:
      if (options.byweekday) {
        retval.byweekday = options.byweekday
      }
      break
    case Frequency.MONTHLY:
      // Absolute month day.
      if (options.bymonthday) {
        retval.bymonthday = options.bymonthday
        // Relative month weekday.
      } else if (options.bysetpos) {
        retval.bysetpos = options.bysetpos
        retval.byweekday = options.byweekday
      }
      break
  }

  if (options.interval && options.interval !== 1) {
    retval.interval = options.interval
  }

  // Sets the terminating condition.
  if (options.until) {
    retval.until = options.until
  } else if (options.count) {
    retval.count = options.count
  }

  return retval
}
