export type StateStatus = 'Idle' | 'Loading' | 'Error'

export interface StateError {
  url?: string
  status?: number
  message: string
}
