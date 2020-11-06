<template>
  <v-row>
    <v-col>
      <v-card v-if="missing === false">
        <v-card-title>Email Verified!</v-card-title>

        <v-card-text>
          Thank you for verifying your email address.

          <v-btn class="mt-3" block to="/">Home</v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class AccountEmailVerification extends Vue {
  token = ''
  missing = false

  async fetch() {
    const token = this.$route.query.token as string

    if (!token) {
      this.missing = true
      return
    }

    await this.$accessor.auth.verify(token)

    await this.$accessor.auth.getMe()
  }
}
</script>
