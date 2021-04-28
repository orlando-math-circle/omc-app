import { reactive } from '@nuxtjs/composition-api'

/**
 * Returns a reactive state object that can be reset to its initial value.
 *
 * @param data State data
 */
export default function useStateReset<T extends Record<string, unknown>>(
  data: T
) {
  const state = reactive<T>(Object.assign({}, data))
  const backup = reactive<T>(Object.assign({}, data))

  const reset = () => {
    Object.assign(state, backup)
  }

  return {
    state,
    reset,
  }
}
