import { Context } from '@nuxt/types'
import { useContext } from '@nuxtjs/composition-api'
import { CookieSerializeOptions } from 'cookie'
import { GetOptions } from 'cookie-universal-nuxt'
import { useAuth } from '@/store/useAuth'

const THOUSAND_YEARS = 365 * 24 * 60 * 60 * 1000

export const useCookies = (ctx?: Context) => {
  const authStore = useAuth()
  const { $cookies } = ctx || useContext()

  const get = (key: string, options?: GetOptions) => {
    return $cookies.get(key, options)
  }

  const set = (
    key: string,
    value: any,
    options: CookieSerializeOptions = {
      maxAge: authStore.remember ? THOUSAND_YEARS : undefined,
    }
  ) => {
    $cookies.set(key, value, options)
  }

  const remove = (key: string, options?: CookieSerializeOptions) => {
    $cookies.remove(key, options)
  }

  const removeAll = () => $cookies.removeAll()

  return {
    get,
    set,
    remove,
    removeAll,
  }
}
