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
          <h2>Registration</h2>
          <span class="subheader">Welcome to Orlando Math Circle</span>
          <span class="d-flex subheader"
            >Already registered?
            <nuxt-link class="pl-2" to="/login">Log in</nuxt-link></span
          >

          <alert-error v-if="error" :error="error" class="mt-3"> </alert-error>

          <v-form-validated @submit:form="onSubmit">
            <v-row>
              <v-col>
                <v-text-field-validated
                  v-model="dto.first"
                  label="First Name"
                  rules="required"
                  hide-details="auto"
                  outlined
                ></v-text-field-validated>
              </v-col>

              <v-col>
                <v-text-field-validated
                  v-model="dto.last"
                  label="Last Name"
                  rules="required"
                  hide-details="auto"
                  outlined
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <validation-provider
                  v-slot="{ errors }"
                  :rules="{
                    min_age: 18,
                    max_age: 100,
                  }"
                  name="Birthday"
                >
                  <birthday-picker v-model="dto.dob" outlined />

                  <div class="v-text-field__details">
                    <div class="v-messages error--text">
                      <div class="v-messages__wrapper">
                        <div v-if="errors.length" class="v-messages__message">
                          {{ errors[0] }}
                        </div>
                      </div>
                    </div>
                  </div>
                </validation-provider>
              </v-col>
            </v-row>

            <v-select-validated
              v-model="dto.sex"
              :items="genders"
              rules="required"
              label="Sex"
              outlined
            >
              <template #append-outer>
                <v-tooltip left>
                  <template #activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">mdi-help</v-icon>
                  </template>

                  <span
                    >We only collect this information for our girls-only and
                    boys-only events.</span
                  >
                </v-tooltip>
              </template>
            </v-select-validated>

            <v-text-field-validated
              v-model="dto.email"
              name="Email"
              rules="required|email"
              autocomplete="email"
              label="Email"
              outlined
            />

            <v-text-field-validated
              v-model="dto.password"
              label="Password"
              type="password"
              rules="required"
              autocomplete="new-password"
              vid="password"
              outlined
            >
            </v-text-field-validated>

            <v-text-field-validated
              v-model="passwordConfirm"
              label="Confirm Password"
              type="password"
              autocomplete="new-password"
              rules="required|password:@password"
              outlined
            >
            </v-text-field-validated>

            <v-checkbox-validated
              v-model="professional"
              label="Are you an industry professional?"
              hide-details
            ></v-checkbox-validated>

            <v-expand-transition>
              <div v-show="professional">
                <v-text-field-validated
                  label="Profession (Optional)"
                ></v-text-field-validated>

                <v-text-field-validated
                  label="Job Title (Optional)"
                ></v-text-field-validated>

                <v-text-field-validated
                  label="Company or Workplace (Optional)"
                ></v-text-field-validated>
              </div>
            </v-expand-transition>

            <v-checkbox
              label="Receive emails about upcoming events"
              hide-details
            ></v-checkbox>

            <v-checkbox
              label="Receive emails reminding me of registered events"
              hide-details
            ></v-checkbox>

            <v-btn block class="my-4" type="submit" color="secondary">
              Sign up
            </v-btn>

            <div class="mb-5">
              By continuing to register you are agreeing to our
              <a
                href="https://www.orlandomathcircle.org/privacy-policy/"
                target="blank"
                rel="noreferrer"
                >privacy policy</a
              >.
            </div>
          </v-form-validated>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { Sex } from '../../backend/src/user/enums/sex.enum'
import { StateStatus } from '../interfaces/state.interface'
import { CreateAccountDto } from '~/../backend/src/account/dtos/create-account.dto'

@Component({
  layout: 'landing',
  head: {
    title: 'Register',
  },
  components: {
    ValidationObserver,
    ValidationProvider,
  },
})
export default class RegisterPage extends Vue {
  student = false

  genders = [
    { text: 'Female', value: 'female' },
    { text: 'Male', value: 'male' },
  ]

  educationLevels = {
    'Middle School': [
      { text: '6th Grade', value: 6 },
      { text: '7th Grade', value: 7 },
      { text: '8th Grade', value: 8 },
    ],
    'High School': [
      { text: '9th Grade', value: 9 },
      { text: '10th Grade', value: 10 },
      { text: '11th Grade', value: 11 },
      { text: '12th Grade', value: 12 },
    ],
    College: [
      { text: 'Undergraduate', value: 'Undergrad' },
      { text: 'Postgraduate', value: 'Postgrad' },
    ],
  }

  agreements = {
    release: false,
  }

  education: keyof this['educationLevels'] = 'Middle School'

  professional = false

  dto = {
    first: '',
    last: '',
    password: '',
    sex: null as Sex | null,
    dob: null as Date | null,
    email: '',
    grade: 0,
  }

  passwordConfirm = ''

  get error() {
    return this.$accessor.auth.isErrored && this.$accessor.auth.error!
  }

  beforeMount() {
    // Clear residual errors from login.
    this.$accessor.auth.setStatus(StateStatus.WAITING)

    console.log(this.$accessor.auth.error, this.$accessor.auth.status)
  }

  async onSubmit() {
    await this.$accessor.auth.register(this.dto as CreateAccountDto)

    if (this.error) return

    this.$router.push('/home')
  }
}
</script>

<style lang="scss" scoped>
.fill-calc {
  height: calc(100% - 64px);
}
</style>
