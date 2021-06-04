import { customRef, useContext } from '@nuxtjs/composition-api'
import { useCookies } from './useCookies'

export const useDarkMode = () => {
  const cookies = useCookies()
  const { $vuetify } = useContext()

  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return $vuetify.theme.dark
      },
      set(value: boolean) {
        $vuetify.theme.dark = value
        cookies.set('omc-theme-dark', value)
        trigger()
      },
    }
  })
}
