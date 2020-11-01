<template>
  <div style="height: 100%">
    <v-toolbar flat color="transparent">
      <v-btn icon to="/">
        <v-icon large>mdi-chevron-left</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container fill-height>
      <v-row align="end" justify="center" no-gutters>
        <v-col cols="10" md="6">
          <h2>Sign in</h2>

          <v-alert v-if="authFailure" type="error" color="accent">
            Email or password incorrect.
          </v-alert>

          <validation-observer ref="observer">
            <v-form @submit.prevent="login">
              <validation-provider
                v-slot="{ errors }"
                name="email"
                rules="required|email"
              >
                <v-text-field
                  v-model="email"
                  label="Email"
                  type="email"
                  autocomplete="email"
                  prepend-inner-icon="mdi-email-outline"
                  :error-messages="errors"
                  required
                />
              </validation-provider>
              <v-text-field
                v-model="password"
                label="Password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'test' : 'password'"
                autocomplete="current-password"
                prepend-inner-icon="mdi-lock-outline"
                required
                @click:append="showPassword = !showPassword"
              />

              <v-row no-gutters>
                <v-col align="center">
                  <v-checkbox v-model="remember" label="Remember me?" />
                </v-col>

                <v-col align="center" justify="center" class="forgot">
                  <nuxt-link to="/forgot">Forgot password?</nuxt-link>
                </v-col>
              </v-row>

              <v-btn block type="submit" color="primary" :loading="loading">
                Log in
              </v-btn>
              <div class="or-separator">or</div>
              <v-btn block outlined color="accent" to="/register"
                >Sign up</v-btn
              >
            </v-form>
          </validation-observer>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  middleware: 'guest',
  layout: 'landing',
  head: {
    title: 'Login',
  },
})
export default class LoginPage extends Vue {
  private email = ''
  private password = ''

  showPassword = false
  error: Error | null = null
  authFailure = false
  loading = false
  remember = true

  async login() {
    this.authFailure = false
    this.loading = true

    try {
      await this.$accessor.auth.login({
        email: this.email,
        password: this.password,
        remember: this.remember,
      })

      if (this.$accessor.auth.complete) {
        this.$router.push('/')
      } else {
        this.$router.push('/switcher')
      }
    } catch (error) {
      // TODO: Catch other types of errors with fallback message.
      if (error.response) {
        if (error.response.status === 401) {
          this.authFailure = true
        }
      }
    } finally {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.forgot {
  display: flex;
  align-self: center;
  margin-left: 15px;
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
