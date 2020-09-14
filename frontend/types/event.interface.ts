export interface Event {
  id: number
  name?: string
  description?: string
  picture?: string
  color?: string
  dtstart: string
  dtend: string
  originalStart?: string
  recurrence?: any
  author?: any
}
