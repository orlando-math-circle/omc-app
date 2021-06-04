import { StateError, StateStatus } from '@/types/state.interface'
import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { PiniaPluginContext } from 'pinia'
import { parseAxiosError } from '@/utils/utilities'
import { StateErrorHandler } from '@/plugins/error'

declare module 'pinia' {
  export interface PiniaCustomStateProperties {
    status: StateStatus
    error: StateError | null
    isLoading: boolean
  }
}

type Procedure = (...args: any[]) => any
type StoreType = PiniaPluginContext['store']

const wrap = <F extends Procedure>(
  fn: F,
  store: StoreType,
  $error: StateErrorHandler
) => {
  const wrappedFn = async (...args: any[]) => {
    try {
      store.status = 'Loading'
      store.error = null

      const result = await Promise.resolve(fn(...args))

      store.status = 'Idle'

      return result
    } catch (error) {
      store.status = 'Error'
      store.error = parseAxiosError(error)

      $error(error)
    }
  }
  return wrappedFn
}

export default defineNuxtPlugin(({ $pinia, $error }) => {
  $pinia.use(({ store, options }) => {
    // Disabled until https://github.com/posva/pinia/discussions/497 is resolved.
    //
    // if (!Object.hasOwnProperty.call(store.$state, 'status')) {
    //   const statusRef = ref('Idle')
    //   set(store.$state, 'status', statusRef)
    //   set(store, 'status', statusRef)

    //   const loadingRef = computed(() => store.status === 'Loading')
    //   set(store.$state, 'isLoading', loadingRef)
    //   set(store, 'isLoading', loadingRef)
    // }

    if (!options.actions) return

    return Object.keys(options.actions).reduce(
      (actions: Record<string, Procedure>, action) => {
        actions[action] = wrap(store[action], store, $error)

        return actions
      },
      {}
    )
  })
})
