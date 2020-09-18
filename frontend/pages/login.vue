<template>
  <div class="wave-top">
    <v-toolbar flat color="transparent">
      <v-btn icon to="/">
        <v-icon large>mdi-chevron-left</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container fill-height>
      <v-row align="end" justify="center">
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
                prepend-inner-icon="mdi-lock-outline"
                required
                @click:append="showPassword = !showPassword"
              />

              <v-row no-gutters>
                <v-col>
                  <v-checkbox label="Remember me?" />
                </v-col>

                <v-col>
                  <nuxt-link to="/forgot">Forgot password?</nuxt-link>
                </v-col>
              </v-row>

              <v-btn block type="submit" :loading="loading">Log in</v-btn>
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
import Component from 'vue-class-component'
import { Vue } from 'vue-property-decorator'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

@Component({
  layout: 'landing',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
})
export default class LoginPage extends Vue {
  private email = ''
  private password = ''
  private showPassword = false
  private error: any
  private authFailure = false
  private loading = false

  async login() {
    this.authFailure = false
    this.loading = true

    try {
      await this.$auth.loginWith('local', {
        data: { email: this.email, password: this.password },
      })
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          this.authFailure = true
        }
        console.log(error.response)
      }
      console.log(error)
    } finally {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.wave-top {
  position: relative;
  height: 100%;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 50vw;
    background-size: cover;
    background-image: url('~assets/images/welcome-wave.svg');
    overflow: visible;
    z-index: -1;
  }
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
