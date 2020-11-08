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

          <v-form-validated @submit:form="onSubmit">
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

            <birthday-picker v-model="dto.dob"></birthday-picker>

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

            <v-checkbox-validated
              v-model="student"
              label="Are you a student?"
              hide-details
            >
            </v-checkbox-validated>

            <v-expand-transition>
              <div v-show="student">
                <v-select-validated
                  v-model="education"
                  label="Education Level"
                  :items="Object.keys(educationLevels)"
                ></v-select-validated>

                <v-select-validated
                  :label="
                    education === 'College' ? 'Level of Study' : 'Grade Level'
                  "
                  :items="educationLevels[education]"
                ></v-select-validated>

                <v-text-field-validated
                  label="School Name"
                  hint="Enter the name of your school or institution."
                ></v-text-field-validated>
              </div>
            </v-expand-transition>

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

            <v-btn block class="mt-4" type="submit">Sign up</v-btn>
          </v-form-validated>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
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
  student = false

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

  education: keyof this['educationLevels'] = 'Middle School'

  professional = false

  dto = {
    first: '',
    last: '',
    password: '',
    dob: null as Date | null,
    email: '',
    grade: 0,
  }

  passwordConfirm = ''

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
