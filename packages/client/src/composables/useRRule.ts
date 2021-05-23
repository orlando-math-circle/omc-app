import { RRuleSet, rrulestr, Options, Frequency } from 'rrule'
import { EntityDTO } from '@server/shared/types/entity-dto'

// TODO: Create a more reliable type.
export type RRuleOptions = EntityDTO<
  Omit<Partial<Options>, 'freq'> & {
    freq: Frequency
    [key: string]: any
  }
>

export const useRRule = () => {
  /**
   * Converts a serialized RRule string back into
   * the options that were used to create it.
   *
   * @param rruleStr Serialized RRule string.
   * @returns Options used to create the RRule.
   */
  const getDeserialized = (rruleStr: string) => {
    const rrule = rrulestr(rruleStr)

    let options

    if (rrule instanceof RRuleSet) {
      options = rrule.rrules()[0].origOptions
    } else {
      options = rrule.origOptions
    }

    return cleanOptions(options as RRuleOptions)
  }

  /**
   * Removes undefined properties from a deserialized RRule
   * and converts any dates into ISO strings.
   *
   * @param options RRule Options.
   * @returns Normalized options.
   */
  const cleanOptions = (options: RRuleOptions) => {
    return Object.keys(options).reduce((cleaned, key) => {
      if (options[key] !== undefined) {
        return {
          ...cleaned,
          [key]:
            options[key] instanceof Date
              ? options[key].toISOString()
              : options[key],
        }
      }

      return cleaned
    }, {} as RRuleOptions)
  }

  return {
    getDeserialized,
    cleanOptions,
  }
}
