import { customRef } from '@nuxtjs/composition-api'

/**
 * Creates a ref that updates on a debounced delay.
 *
 * @param value Ref value.
 * @param delay Debounce delay.
 */
export const useDebouncedRef = <T>(value: T, delay = 250) => {
  let timeout: ReturnType<typeof setTimeout>

  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue: T) {
        clearTimeout(timeout)

        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      },
    }
  })
}
