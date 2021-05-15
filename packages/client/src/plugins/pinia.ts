import { defineNuxtPlugin, onGlobalSetup } from '@nuxtjs/composition-api'
import { PiniaPluginContext } from 'pinia'
import { useAuth } from '@/store/useAuth'
import { useCookies } from '@/composables/useCookies'
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
  const wrappedFn = async (
    ...args: Parameters<F>
  ): Promise<ReturnType<F> | undefined> => {
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

export function useState({ options, store }: PiniaPluginContext) {
  store.status = 'Idle'
  store.error = null

  options.getters = options.getters || {}
  options.getters.isLoading = (state) => state.status === 'Loading'

  options.actions = options.actions || {}
  return Object.keys(options.actions).reduce(
    (wrappedActions: PiniaPluginContext['store']['actions'], action) => {
      wrappedActions[action] = wrap(store[action], store)

      return wrappedActions
    },
    {}
  )
}

export default defineNuxtPlugin(({ pinia }) => {
  pinia.use(useState)

  onGlobalSetup(async () => {
    const auth = useAuth()
    const cookies = useCookies()

    const token = cookies.get(COOKIE_JWT)
    const complete = cookies.get(COOKIE_COMPLETE) || false
    const calendarType = cookies.get(COOKIE_CALENDAR_TYPE)

    if (calendarType) {
      auth.settings.calendarType = calendarType
    }

    if (!token) return

    cookies.set(COOKIE_JWT, token)
    cookies.set(COOKIE_COMPLETE, complete)
    auth.token = token
    auth.complete = complete

    if (complete) {
      await auth.getMyUser()
    } else {
      await auth.getMyAccount()
    }

    if (auth.error?.status === 401) {
      cookies.remove(COOKIE_JWT)
      cookies.remove(COOKIE_COMPLETE)
    }
  })
})
