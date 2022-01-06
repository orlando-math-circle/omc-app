import { useScheduler } from './useScheduler'

describe('useScheduler', () => {
  it('should have a default date', () => {
    const scheduler = useScheduler()

    console.log(scheduler.dtstart, scheduler.dtend)
  })
})
