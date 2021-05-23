import {
  customRef,
  getCurrentInstance,
  onMounted,
  onUpdated,
  Ref,
} from '@nuxtjs/composition-api'

/**
 * Shorthand for binding ref to a template element.
 *
 * Taken from the `vueuse` repository and modded to not be nullish.
 */
export const useTemplateRef = <T extends object>(key: string) => {
  const instance = getCurrentInstance()
  let _trigger = () => {}

  const element = customRef((track, trigger) => {
    _trigger = trigger
    return {
      get() {
        track()
        return instance?.proxy?.$refs[key] ?? null
      },
      set() {},
    }
  })

  onMounted(_trigger)
  onUpdated(_trigger)

  return element as Readonly<Ref<T>>
}
