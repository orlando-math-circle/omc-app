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
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  fetchOnServer: false,
})
export default class AccountEmailVerification extends Vue {
  token = ''
  missing = false
  gone = false

  get title() {
    if (this.$fetchState.pending) {
      return 'Loading...'
    } else if (this.missing) {
      return 'Token Missing'
    } else if (this.gone) {
      return 'Already Verified'
    }

    return 'Email Verified!'
  }

  get body() {
    if (this.$fetchState.pending) {
      return 'Please wait while the token is being verified'
    } else if (this.missing) {
      return 'The verification link is malformed. Make sure you copy the entire link from the email.'
    } else if (this.gone) {
      return 'Your email has already been verified.'
    }

    return 'Thank you for verifying your email. You are now eligible to register to upcoming events and receive email notifications.'
  }

  async fetch() {
    const token = this.$route.query.token

    if (Array.isArray(token)) return

    if (!token) {
      this.missing = true
      return
    }

    await this.$accessor.auth.verify(token)

    if (this.$accessor.auth.isErrored) {
      // Check if it's already been verified
      if (this.$accessor.auth.error?.status === 410) {
        this.gone = true
        return
      }

      this.$accessor.snackbar.show({
        text: this.$accessor.auth.error!.message,
        timeout: 10000,
      })
    }

    await this.$accessor.auth.getMe()
  }
}
</script>
