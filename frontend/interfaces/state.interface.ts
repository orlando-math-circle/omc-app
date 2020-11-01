export enum State {
  UNLOADED = 0,
  WAITING = 1,
  BUSY = 2,
  ERROR = 3,
}

export interface StatePayload {
  status: State
  error?: Error
}
