import { extend } from 'vee-validate'
import { email } from 'vee-validate/dist/rules'
import { parse } from 'date-fns'
import { getTimeValue } from '../utils/utilities'

extend('email', email)

extend('required', {
  validate(value) {
    return {
      required: true,
      valid: !['', null, undefined].includes(value),
    }
  },
  computesRequired: true,
  message: 'This field is required.',
})

extend('startdate', {
  params: ['date'],
  validate: (value, { date }: any) => {
    return (
      parse(value, 'EEEE, LLLL do', new Date()) <=
      parse(date, 'EEEE, LLLL do', new Date())
    )
  },
  message: 'Start date cannot be after the end date.',
})

extend('starttime', {
  params: ['time'],
  validate: (value, { time }: any) => getTimeValue(value) <= getTimeValue(time),
  message: 'Start time cannot be after end time',
})
