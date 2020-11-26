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

          <v-alert v-if="authError" type="error" color="accent">
            Email or password incorrect.
          </v-alert>

          <v-form-validated @submit:form="login">
            <v-text-field-validated
              v-model="email"
              label="Email"
              type="email"
              autocomplete="email"
              rules="required|email"
              prepend-inner-icon="mdi-email-outline"
              required
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
              @click:append="showPassword = !showPassword"
            ></v-text-field-validated>

            <v-row no-gutters>
              <v-col align="center">
                <v-checkbox v-model="remember" label="Remember me?" />
              </v-col>

              <v-col align="center" justify="center" class="forgot">
                <nuxt-link to="/forgot">Forgot password?</nuxt-link>
              </v-col>
            </v-row>

            <v-btn block type="submit" color="primary" :loading="isLoading">
              Log in
            </v-btn>
            <div class="or-separator">or</div>
            <v-btn block outlined color="accent" to="/register">Sign up</v-btn>
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

  get authError() {
    return this.$accessor.auth.error
  }

  async login() {
    await this.$accessor.auth.login({
      email: this.email,
      password: this.password,
      remember: this.remember,
    })

    if (this.$accessor.auth.error) return

    if (this.$accessor.auth.complete) {
      this.$router.push('/')
    } else {
      this.$router.push('/switcher')
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
