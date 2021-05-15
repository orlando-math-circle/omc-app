<template>
  <v-container fluid fill-height>
    <v-row justify="center">
      <v-col>
        <client-only>
          <!-- Enter Email Mode -->
          <v-card v-if="!token" :loading="$fetchState.pending">
            <v-card-title>{{ title }}</v-card-title>

            <v-card-subtitle>{{ body }}</v-card-subtitle>

            <VFormValidated v-if="status === 'waiting'" @form:submit="onForgot">
              <v-card-text>
                <VTextFieldValidated
                  v-model="email"
                  label="Email"
                  name="email"
                  rules="required"
                  outlined
                />
              </v-card-text>

              <v-card-actions>
                <v-btn block :loading="isLoading" type="submit" color="primary">
                  Send Reset Link
                </v-btn>
              </v-card-actions>
            </VFormValidated>

            <v-card-text v-else>
              <v-btn to="/" block color="secondary">Home</v-btn>
            </v-card-text>
          </v-card>

          <!-- Token Mode -->
          <v-card v-else :loading="isLoading">
            <v-card-title>{{ title }}</v-card-title>

            <v-card-subtitle>{{ body }}</v-card-subtitle>

            <VFormValidated v-if="status === 'waiting'" @form:submit="onReset">
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <VTextFieldValidated
                      v-model="newPassword"
                      label="New Password"
                      type="password"
                      rules="required"
                      autocomplete="new-password"
                      vid="password"
                      outlined
                      hide-details="auto"
                    />
                  </v-col>

                  <v-col cols="12">
                    <VTextFieldValidated
                      v-model="conPassword"
                      label="Confirm New Password"
                      type="password"
                      autocomplete="new-password"
                      rules="required|password:@password"
                      outlined
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-btn block :loading="isLoading" type="submit" color="primary">
                  Change Password
                </v-btn>
              </v-card-actions>
            </VFormValidated>

            <v-card-text v-else>
              <v-btn to="/" block color="secondary">Home</v-btn>
            </v-card-text>
          </v-card>
        </client-only>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  reactive,
  useRoute,
  computed,
  useFetch,
} from '@nuxtjs/composition-api'
import { useSnackbar } from '../composables/useSnackbar'
import { useAuth } from '../store/useAuth'

export default defineComponent({
  layout: 'landing',
  fetchOnServer: false,
  setup() {
    const route = useRoute()
    const authStore = useAuth()
    const snackbar = useSnackbar()

    const state = reactive({
      status: 'waiting' as
        | 'token:gone'
        | 'token:complete'
        | 'request:sent'
        | 'waiting',
      email: '',
      password: '',
      confirm: '',
    })

    const token = computed(() => {
      const value = route.value.query.token

      return typeof value === 'string' ? value : null
    })

    const { fetchState } = useFetch(async () => {
      if (!token.value) return

      await authStore.verifyReset(token.value)

      if (authStore.error) {
        state.status = 'token:gone'
        snackbar.error(authStore.error.message)
      } else {
        state.status = 'waiting'
      }
    })

    const title = computed(() => {
      if (fetchState.pending) {
        return 'Loading...'
      }

      switch (state.status) {
        case 'waiting':
          return token.value ? 'Set a New Password' : 'Enter Your Email'
        case 'token:gone':
          return 'Link Expired'
        case 'request:sent':
          return 'On Its Way!'
        case 'token:complete':
          return 'Password is Reset'
      }
    })

    const body = computed(() => {
      if (state.status === 'waiting') {
        return token.value
          ? 'Enter a new password to use for your account'
          : 'Enter your email address for the account you wish to reset'
      } else if (state.status === 'token:gone') {
        return 'The token is expired and is no longer usable, try sending a new password reset request.'
      } else if (state.status === 'token:complete') {
        return 'Your password has been successfully changed.'
      } else if (state.status === 'request:sent') {
        return 'Your request has been accepted. Check your email!'
      }
    })

    const onForgot = async () => {
      await authStore.forgotPassword(state.email)

      if (authStore.error) {
        return snackbar.error(authStore.error.message)
      }

      snackbar.success('Successfully Sent')

      state.status = 'request:sent'
    }

    const onReset = async () => {
      await authStore.resetPassword({
        token: token.value!,
        password: state.password,
      })

      if (authStore.error) {
        return snackbar.error(authStore.error.message)
      }

      snackbar.success('Password Changed Successfully')

      state.status = 'token:complete'
    }

    return {
      ...toRefs(state),
      isLoading: computed(() => authStore.isLoading),
      token,
      title,
      body,
      onForgot,
      onReset,
    }
  },
  head: {
    title: 'Forgot Reset',
  },
})
</script>
