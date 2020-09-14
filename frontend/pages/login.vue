<template>
  <v-card>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          required
          outlined
        />
        <v-text-field
          v-model="password"
          label="Password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'test' : 'password'"
          required
          outlined
          @click:append="showPassword = !showPassword"
        />

        <v-btn @click="login">Login</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Vue } from 'vue-property-decorator'

@Component
export default class LoginPage extends Vue {
  private email = ''
  private password = ''
  private showPassword = false
  private error: any

  async login() {
    try {
      await this.$auth.loginWith('local', {
        data: { email: this.email, password: this.password },
      })
    } catch (error) {
      console.log(error)
    }
  }
}
</script>
