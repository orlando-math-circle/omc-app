import { fromISO, toDate } from '../lib'

describe('Time', () => {
  it('should return a date from an iso string', () => {
    const now = new Date()
    const isoString = now.toISOString()

    const converted = fromISO(isoString)

    expect(converted).toBeDefined()
    expect(converted.getTime()).toEqual(now.getTime())
  })

  it('should coalesce iso or dates to dates', () => {
    const now = new Date()

    const converted = toDate(now)

    expect(converted).toEqual(now)

    const isoConverted = toDate(now.toISOString())

    expect(isoConverted).toBeDefined()
    expect(isoConverted.getTime()).toEqual(now.getTime())
  })
})
