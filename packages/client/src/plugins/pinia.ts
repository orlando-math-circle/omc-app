import { useCookies } from '@/composables/useCookies'
import { useAuth } from '@/store/useAuth'
import { defineNuxtPlugin, onGlobalSetup } from '@nuxtjs/composition-api'
import { PiniaPluginContext, PiniaStorePlugin } from 'pinia'
import {
  COOKIE_CALENDAR_TYPE,
  COOKIE_COMPLETE,
  COOKIE_JWT,
} from '../utils/constants'

export type StateStatus = 'Idle' | 'Loading' | 'Error'

export interface StateError {
  url?: string
  status?: number
  message: string
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    status: StateStatus
    error: StateError | null
    isLoading: boolean
  }
}

type Procedure = (...args: any[]) => any
type StoreType = PiniaPluginContext['store']

const wrap = <F extends Procedure>(fn: F, store: StoreType) => {
  const wrappedFn = async (...args: any[]) => {
    try {
      store.status = 'Loading'
      store.error = null

      const result = await Promise.resolve(fn(...args))

      store.status = 'Idle'

      return result
    } catch (error) {
      store.status = 'Error'
      store.error = error
    }
  }
  return wrappedFn
}

const plugin: PiniaStorePlugin = ({ store, options }) => {
  // TODO: Disabled until https://github.com/posva/pinia/discussions/497 is resolved.
  //
  // if (!Object.prototype.hasOwnProperty.call(store.$state, 'status')) {
  //   const statusRef = ref('Idle')
  //   set(store.$state, 'status', statusRef)
  //   set(store, 'status', statusRef)

  //   const loadingRef = computed(() => store.status === 'Loading')
  //   set(store.$state, 'isLoading', loadingRef)
  //   set(store, 'isLoading', loadingRef)
  // }

  if (
    !options.actions ||
    !Object.prototype.hasOwnProperty.call(store.$state, 'status')
  )
    return

  return Object.keys(options.actions).reduce(
    (result: Record<string, Procedure>, action) => {
      result[action] = wrap(store[action], store)

      return result
    },
    {}
  )
}

export default defineNuxtPlugin(({ pinia, $axios }) => {
  pinia.use(plugin)

  onGlobalSetup(async () => {
    // const auth = useAuth()
    // const cookies = useCookies()
    // const token = cookies.get(COOKIE_JWT)
    // const complete = cookies.get(COOKIE_COMPLETE) || false
    // const calendarType = cookies.get(COOKIE_CALENDAR_TYPE)
    // console.log(
    //   `Global Setup [${token.substr(token.length - 5)}] [${complete}]`
    // )
    // if (calendarType) {
    //   auth.settings.calendarType = calendarType
    // }
    // if (!token) return
    // cookies.set(COOKIE_JWT, token)
    // cookies.set(COOKIE_COMPLETE, complete)
    // auth.token = token
    // auth.complete = complete
    // $axios.setToken(token, 'Bearer')
    // if (complete) {
    //   await auth.getMyUser()
    // } else {
    //   await auth.getMyAccount()
    // }
    // if (auth.error?.status === 401) {
    //   auth.token = null
    //   auth.complete = false
    //   cookies.remove(COOKIE_JWT)
    //   cookies.remove(COOKIE_COMPLETE)
    //   $axios.setToken(false)
    // }
  })
})
