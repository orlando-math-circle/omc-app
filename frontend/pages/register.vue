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
              <v-col class="py-0">
                <validation-provider
                  ref="birthday"
                  v-slot="{ errors }"
                  :rules="{
                    min_age: { min: 18 },
                    max_age: { max: 100 },
                  }"
                  name="Birthday"
                >
                  <birthday-picker
                    v-model="dto.dob"
                    :error="errors.length !== 0"
                    outlined
                  />

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
              v-model="dto.gender"
              :items="genders"
              rules="required"
              label="Gender"
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
              v-model="industry"
              label="Are you an industry professional?"
              hide-details
            ></v-checkbox-validated>

            <v-expand-transition>
              <div v-show="industry" class="mt-3">
                <v-text-field-validated
                  v-model="professional.profession"
                  label="Profession (Optional)"
                  outlined
                ></v-text-field-validated>

                <v-text-field-validated
                  v-model="professional.jobTitle"
                  label="Job Title (Optional)"
                  outlined
                ></v-text-field-validated>

                <v-text-field-validated
                  v-model="professional.company"
                  label="Company or Workplace (Optional)"
                  outlined
                ></v-text-field-validated>
              </div>
            </v-expand-transition>

            <v-checkbox
              v-model="notifyDefault"
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
import { Gender } from '../../backend/src/user/enums/gender.enum'
import { StateStatus } from '../interfaces/state.interface'
import { genders } from '../utils/constants'
import { ReminderFreq } from '../../backend/src/user/enums/reminder-freq.enum'
import { CreateAccountDto } from '../../backend/src/account/dtos/create-account.dto'

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
  genders = genders
  passwordConfirm = ''
  notifyDefault = true

  industry = false
  professional = {
    profession: '' as string | null,
    jobTitle: '' as string | null,
    company: '' as string | null,
  }

  dto = {
    first: '',
    last: '',
    password: '',
    gender: null as Gender | null,
    dob: null as Date | null,
    email: '',
    grade: 0,
  }

  get error() {
    return this.$accessor.auth.isErrored && this.$accessor.auth.error!
  }

  beforeMount() {
    // Clear residual errors from login.
    this.$accessor.auth.setStatus(StateStatus.WAITING)
  }

  async onSubmit() {
    await this.$accessor.auth.register(
      Object.assign(
        {},
        this.dto,
        this.notifyDefault && { reminders: [ReminderFreq.HOUR] },
        this.industry && { industry: this.professional }
      ) as CreateAccountDto
    )

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
