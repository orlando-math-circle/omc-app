import { reactive } from '@nuxtjs/composition-api'

/**
 * Returns a reactive state object that can be reset to its initial value.
 *
 * @param data State data
 */
export default function useStateReset<T extends Record<string, unknown>>(
  data: T
) {
  const state = reactive({ ...data })
  const backup = { ...data }

  const reset = () => {
    Object.assign(state, backup)
  }

  return {
    state,
    reset,
  }
}
