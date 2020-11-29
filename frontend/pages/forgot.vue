<template>
  <v-container fluid fill-height>
    <v-row justify="center">
      <v-col>
        <client-only>
          <!-- Enter Email Mode -->
          <v-card v-if="!token" :loading="$fetchState.pending">
            <v-card-title>{{ title }}</v-card-title>

            <v-card-subtitle>{{ body }}</v-card-subtitle>

            <v-form-validated
              v-if="status === 'waiting'"
              @submit:form="onSubmit"
            >
              <v-card-text>
                <v-text-field-validated
                  v-model="email"
                  label="Email"
                  name="email"
                  rules="required"
                  outlined
                ></v-text-field-validated>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  block
                  :loading="$accessor.auth.isLoading"
                  type="submit"
                  color="primary"
                  >Send Reset Link</v-btn
                >
              </v-card-actions>
            </v-form-validated>

            <v-card-text v-else>
              <v-btn to="/" block color="secondary">Home</v-btn>
            </v-card-text>
          </v-card>

          <!-- Token Mode -->
          <v-card v-else :loading="$accessor.auth.isLoading">
            <v-card-title>{{ title }}</v-card-title>

            <v-card-subtitle>{{ body }}</v-card-subtitle>

            <v-form-validated
              v-if="status === 'waiting'"
              @submit:form="submitComplete"
            >
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field-validated
                      v-model="newPassword"
                      label="New Password"
                      type="password"
                      rules="required"
                      autocomplete="new-password"
                      vid="password"
                      outlined
                      hide-details="auto"
                    ></v-text-field-validated>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field-validated
                      v-model="conPassword"
                      label="Confirm New Password"
                      type="password"
                      autocomplete="new-password"
                      rules="required|password:@password"
                      outlined
                      hide-details="auto"
                    ></v-text-field-validated>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  block
                  :loading="$accessor.auth.isLoading"
                  type="submit"
                  color="primary"
                  >Change Password</v-btn
                >
              </v-card-actions>
            </v-form-validated>

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
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'landing',
  head: {
    title: 'Forgot Password?',
  },
  fetchOnServer: false,
})
export default class ForgotPasswordPage extends Vue {
  email = ''
  status: 'waiting' | 'token:gone' | 'token:complete' | 'request:sent' =
    'waiting'

  newPassword = ''
  conPassword = ''

  get token() {
    const query = this.$route.query.token

    return !Array.isArray(query) && query ? query : null
  }

  get title() {
    if (this.$fetchState.pending) {
      return 'Loading...'
    }

    switch (this.status) {
      case 'waiting':
        return this.token ? 'Set a New Password' : 'Enter Your Email'
      case 'token:gone':
        return 'Link Expired'
      case 'request:sent':
        return 'On Its Way!'
      case 'token:complete':
        return 'Password is Reset'
    }
  }

  get body() {
    if (this.status === 'waiting') {
      return this.token
        ? 'Enter a new password to use for your account'
        : 'Enter your email address for the account you wish to reset'
    } else if (this.status === 'token:gone') {
      return 'The token is expired and is no longer usable, try sending a new password reset request.'
    } else if (this.status === 'token:complete') {
      return 'Your password has been successfully changed.'
    } else if (this.status === 'request:sent') {
      return 'Your request has been accepted. Check your email!'
    }
  }

  async fetch() {
    // If there is no token, this is not the correct mode
    if (!this.token) return

    await this.$accessor.auth.verifyResetPassword(this.token)

    if (this.$accessor.auth.isErrored) {
      this.status = 'token:gone'
      this.$accessor.snackbar.show({
        text: this.$accessor.auth.error!.message,
        timeout: 10000,
      })
    } else {
      this.status = 'waiting'
    }
  }

  async onSubmit() {
    await this.$accessor.auth.forgotPassword(this.email)

    if (this.$accessor.auth.isErrored) {
      return this.$accessor.snackbar.show({
        text: this.$accessor.auth.error!.message,
        timeout: 10000,
      })
    }

    this.$accessor.snackbar.show({
      text: 'Successfully Sent',
    })

    this.status = 'request:sent'
  }

  async submitComplete() {
    await this.$accessor.auth.resetPassword({
      token: this.token!,
      password: this.newPassword,
    })

    if (this.$accessor.auth.isErrored) {
      return this.$accessor.snackbar.show({
        text: this.$accessor.auth.error!.message,
        timeout: 10000,
      })
    }

    this.$accessor.snackbar.show({
      text: 'Password Successfully Changed',
    })

    this.status = 'token:complete'
  }
}
</script>
