<template>
  <v-row>
    <v-col>
      <v-card :loading="$fetchState.pending">
        <v-card-title>{{ title }}</v-card-title>

        <v-card-text>
          {{ body }}

          <v-btn class="mt-3" block to="/" color="secondary">Home</v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import { useAuth } from '@/store/useAuth'
import { useSnackbar } from '../composables/useSnackbar'

export default defineComponent({
  fetchOnServer: false,
  setup() {
    const route = useRoute()
    const authStore = useAuth()
    const snackbar = useSnackbar()

    const state = reactive({
      token: '',
      missing: false,
      gone: false,
    })

    const { fetchState } = useFetch(async () => {
      const token = route.value.query.token

      if (!token || typeof token !== 'string') {
        state.missing = true
        return
      }

      await authStore.verifyEmail(token)

      if (authStore.error) {
        if (authStore.error.status === 410) {
          state.gone = true
          return
        }

        snackbar.error(authStore.error.message)
      }

      await authStore.getMyUser()
    })

    const title = computed(() => {
      if (fetchState.pending) {
        return 'Loading...'
      } else if (state.missing) {
        return 'Token Missing'
      } else if (state.gone) {
        return 'Already Verified'
      }

      return 'Email Verified'
    })

    const body = computed(() => {
      if (fetchState.pending) {
        return 'Please wait while the token is being verified'
      } else if (state.missing) {
        return 'The verification link is malformed. Make sure you copy the entire link from the email.'
      } else if (state.gone) {
        return 'Your email has already been verified.'
      }

      return 'Thank you for verifying your email. You are now eligible to register to upcoming events and receive email notifications.'
    })

    return { title, body }
  },
})
</script>
