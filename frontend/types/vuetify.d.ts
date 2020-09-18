import { Framework } from 'vuetify'

declare module '@nuxt/types' {
  interface Context {
    $vuetify: Framework
  }
}
