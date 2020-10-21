<template>
  <div style="height: 100%">
    <v-toolbar flat color="transparent">
      <v-btn icon to="/">
        <v-icon large>mdi-chevron-left</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container fill-height>
      <v-row align="start" justify="center" no-gutters>
        <v-col cols="10" md="6">
          <h2>Registration</h2>
          <span class="subheader">Welcome to Orlando Math Circle</span>
          <span class="d-flex subheader"
            >Already registered?
            <nuxt-link class="pl-2" to="/login">Log in</nuxt-link></span
          >

          <ValidationObserver ref="form" v-slot="{ passes }">
            <v-form @submit.prevent="passes(onSubmit)">
              <v-row>
                <alert-error
                  v-if="$accessor.auth.error"
                  :error="$accessor.auth.error"
                >
                </alert-error>

                <v-col>
                  <v-text-field-validated
                    v-model="dto.first"
                    label="First Name"
                    rules="required"
                    hide-details
                  ></v-text-field-validated>
                </v-col>

                <v-col>
                  <v-text-field-validated
                    v-model="dto.last"
                    label="Last Name"
                    hide-details
                  ></v-text-field-validated>
                </v-col>
              </v-row>

              <v-row class="pa-0">
                <v-col cols="6">
                  <v-select-validated
                    v-model="birthday.month"
                    label="Birthday Month"
                    autocomplete="bday-month"
                    :items="months"
                    hide-details
                  ></v-select-validated>
                </v-col>

                <v-col cols="3">
                  <v-text-field-validated
                    v-model.number="birthday.day"
                    type="number"
                    label="Day"
                    hide-details
                  ></v-text-field-validated>
                </v-col>

                <v-col cols="3">
                  <v-text-field-validated
                    v-model.number="birthday.year"
                    type="number"
                    label="Year"
                    hide-details
                  ></v-text-field-validated>
                </v-col>
              </v-row>

              <v-text-field-validated
                v-model="dto.email"
                rules="required|email"
                autocomplete="email"
                label="Email"
              >
              </v-text-field-validated>

              <v-text-field-validated
                v-model="dto.password"
                label="Password"
                type="password"
                autocomplete="new-password"
                vid="password"
              >
              </v-text-field-validated>

              <v-text-field-validated
                v-model="passwordConfirm"
                label="Confirm Password"
                type="password"
                autocomplete="new-password"
                rules="required|password:@password"
              >
              </v-text-field-validated>

              <v-checkbox
                label="Receive emails about upcoming events"
                dense
                hide-details
              ></v-checkbox>

              <v-checkbox
                label="Receive emails reminding me of registered events"
                dense
                hide-details
              ></v-checkbox>

              <v-btn block class="mt-4" type="submit">Sign up</v-btn>
            </v-form>
          </ValidationObserver>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import { ValidationObserver } from 'vee-validate'
import { CreateAccountDto } from '~/../backend/src/account/dtos/create-account.dto'

@Component({
  layout: 'landing',
  head: {
    title: 'Register',
  },
  components: {
    ValidationObserver,
  },
})
export default class RegisterPage extends Vue {
  months = [
    { text: 'January', value: 0 },
    { text: 'February', value: 1 },
    { text: 'March', value: 2 },
    { text: 'April', value: 3 },
    { text: 'May', value: 4 },
    { text: 'June', value: 5 },
    { text: 'July', value: 6 },
    { text: 'August', value: 7 },
    { text: 'September', value: 8 },
    { text: 'October', value: 9 },
    { text: 'November', value: 10 },
    { text: 'December', value: 11 },
  ]

  birthday = {
    month: null as number | null,
    day: null as number | null,
    year: null as number | null,
  }

  dto = {
    first: '',
    last: '',
    password: '',
    dob: null as Date | null,
    email: '',
    grade: 0,
  }

  passwordConfirm = ''

  @Watch('birthday', { deep: true })
  setDate(birthday: this['birthday']) {
    const dob = new Date(
      birthday.year as number,
      birthday.month as number,
      birthday.day as number
    )

    this.dto.dob = dob
  }

  async onSubmit() {
    try {
      await this.$accessor.auth.register(this.dto as CreateAccountDto)
      this.$router.push('/home')
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style lang="scss" scoped>
.example {
  a {
    text-decoration: none;
  }
}
</style>
