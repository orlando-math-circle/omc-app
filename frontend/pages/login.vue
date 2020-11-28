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

          <v-form-validated @submit:form="login">
            <v-text-field-validated
              v-model="email"
              label="Email"
              name="email"
              type="email"
              autocomplete="email"
              rules="required|email"
              prepend-inner-icon="mdi-email-outline"
              required
              outlined
            ></v-text-field-validated>

            <v-text-field-validated
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
            ></v-text-field-validated>

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
                <nuxt-link to="/forgot">Forgot password?</nuxt-link>
              </v-col>
            </v-row>

            <v-btn block type="submit" color="primary" :loading="isLoading">
              Log in
            </v-btn>
            <div class="or-separator">or</div>
            <v-btn block color="secondary" to="/register">Sign up</v-btn>
          </v-form-validated>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({
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
  remember = true

  get isLoading() {
    return this.$accessor.auth.isLoading
  }

  get error() {
    return this.$accessor.auth.isErrored && this.$accessor.auth.error!
  }

  async login() {
    await this.$accessor.auth.login({
      email: this.email,
      password: this.password,
      remember: this.remember,
    })

    if (this.$accessor.auth.error) return

    if (this.$accessor.auth.complete) {
      console.log('login complete')
      this.$router.push('/')
    } else {
      this.$router.push('/switcher')
    }
  }
}
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
