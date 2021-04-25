<template>
  <div class="fill-calc">
    <v-toolbar flat color="transparent">
      <v-btn icon to="/">
        <v-icon large>mdi-chevron-left</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container fill-height>
      <v-row>
        <v-col>
          <h2>Sign in</h2>

          <v-expand-transition>
            <v-alert v-if="error" type="error" color="secondary">
              <span v-if="error.status === 401">
                Email or password incorrect
              </span>
            </v-alert>
          </v-expand-transition>

          <VFormValidated @form:submit="onLogin">
            <v-row>
              <v-col>
                <VTextFieldValidated
                  v-model="email"
                  label="Email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  rules="required|email"
                  prepend-inner-icon="mdi-email-outline"
                  required
                  outlined
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <VTextFieldValidated
                  v-model="password"
                  label="Password"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  rules="required"
                  autocomplete="current-password"
                  prepend-inner-icon="mdi-lock-outline"
                  required
                  outlined
                  @click:append="showPassword = !showPassword"
                />
              </v-col>
            </v-row>

            <v-row no-gutters class="mb-5">
              <v-col cols="6" class="action">
                <v-checkbox
                  v-model="remember"
                  label="Remember me?"
                  hide-details
                  dense
                />
              </v-col>

              <v-col cols="6" class="action">
                <NuxtLink to="/forgot">Forgot password?</NuxtLink>
              </v-col>
            </v-row>

            <v-btn block type="submit" color="primary" :loading="isLoading">
              Log in
            </v-btn>
            <div class="or-separator">or</div>
            <v-btn block color="secondary" to="/register">Sign up</v-btn>
          </VFormValidated>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  useRouter,
} from '@nuxtjs/composition-api'
import { useAuth } from '@/stores'

export default defineComponent({
  layout: 'landing',
  middleware: 'guest',
  setup() {
    const router = useRouter()
    const authStore = useAuth()

    const state = reactive({
      email: '',
      password: '',
      showPassword: false,
      remember: true,
    })

    const onLogin = async () => {
      await authStore.login(state.email, state.password, state.remember)

      if (authStore.error) return

      router.push(authStore.complete ? '/' : '/switcher')
    }

    return {
      ...toRefs(state),
      error: authStore.error,
      isLoading: authStore.isLoading,
      onLogin,
    }
  },
  head: {
    title: 'Login',
  },
})
</script>

<style lang="scss" scoped>
::v-deep .v-input--selection-controls {
  margin-top: 0;
  padding-top: 0;
}

.fill-calc {
  height: calc(100% - 64px);
}

.action {
  display: flex;
  align-self: center;
  justify-content: center;
  height: 100%;
}

.or-separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 10px 0;
  opacity: 0.5;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #000;
  }

  &::before {
    margin-right: 0.3em;
  }

  &::after {
    margin-left: 0.3em;
  }
}
</style>
