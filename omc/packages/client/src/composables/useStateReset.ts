import { reactive } from '@nuxtjs/composition-api'

/**
 * Returns a reactive state object that can be reset to its initial value.
 *
 * @param data State data
 */
export const useStateReset = <T extends Record<string, unknown>>(data: T) => {
  const state = reactive({ ...data })
  const backup = { ...data }

  /**
   * Sets the new baseline for the state and backup.
   * @param data State parameters.
   */
  const set = (data: T) => {
    Object.assign(state, data)
    Object.assign(backup, data)
  }

  const reset = () => {
    Object.assign(state, backup)
  }

  return {
    state,
    set,
    reset,
  }
}
