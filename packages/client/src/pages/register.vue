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
          <span class="d-flex subheader">
            Already registered?
            <nuxt-link class="pl-2" to="/login">Log in</nuxt-link>
          </span>

          <alert-error v-if="error" :error="error" class="mt-3"> </alert-error>

          <v-form-validated @submit:form="onSubmit">
            <v-row>
              <v-col cols="6">
                <v-text-field-validated
                  v-model="first"
                  label="First Name"
                  rules="required"
                  outlined
                />
              </v-col>

              <v-col cols="6">
                <v-text-field-validated
                  v-model="last"
                  label="Last Name"
                  rules="required"
                  outlined
                />
              </v-col>

              <v-col>
                <birthday-picker-validated v-model="dob" />
              </v-col>

              <v-col cols="12">
                <v-select-validated
                  v-model="gender"
                  :items="genders"
                  rules="required"
                  label="Gender"
                  outlined
                >
                  <template #append>
                    <v-tooltip left>
                      <template #activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on">mdi-help</v-icon>
                      </template>

                      <span
                        >We only collect this information for our focused
                        events.</span
                      >
                    </v-tooltip>
                  </template>
                </v-select-validated>
              </v-col>

              <v-col cols="12">
                <v-text-field-validated
                  v-model="email"
                  name="Email"
                  rules="required|email"
                  autocomplete="email"
                  label="Email"
                  outlined
                />
              </v-col>

              <v-col cols="12">
                <v-text-field-validated
                  v-model="password"
                  label="Password"
                  type="password"
                  rules="required"
                  autocomplete="new-password"
                  vid="password"
                  outlined
                />
              </v-col>

              <v-col cols="12">
                <v-text-field-validated
                  v-model="passwordConfirm"
                  label="Confirm Password"
                  type="password"
                  autocomplete="new-password"
                  rules="required|password:@password"
                  outlined
                />
              </v-col>

              <v-col cols="12">
                <v-checkbox-validated
                  v-model="isIndustry"
                  label="Are you an industry professional?"
                />
              </v-col>

              <v-expand-transition>
                <div v-show="isIndustry" class="mt-3">
                  <v-col cols="12">
                    <v-text-field-validated
                      v-model="industry.profession"
                      label="Profession (Optional)"
                      outlined
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field-validated
                      v-model="industry.jobTitle"
                      label="Job Title (Optional)"
                      outlined
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field-validated
                      v-model="industry.company"
                      label="Company or Workplace (Optional)"
                      outlined
                    />
                  </v-col>
                </div>
              </v-expand-transition>

              <v-checkbox
                v-model="isNotify"
                label="Receive emails reminding me of registered events"
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
            </v-row>
          </v-form-validated>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  reactive,
  toRefs,
  useContext,
  useRouter,
} from '@nuxtjs/composition-api'
import { Gender } from '@server/user/enums/gender.enum'
import { ReminderFreq } from '@server/user/enums/reminder-freq.enum'
import { StateStatus } from '../types/state.interface'
import { genders } from '../utils/constants'

export default defineComponent({
  layout: 'landing',
  setup() {
    const { $accessor: store } = useContext()
    const router = useRouter()

    const state = reactive({
      password: '',
      passwordConfirm: '',
      first: '',
      last: '',
      gender: null as Gender | null,
      dob: '',
      email: '',
      isIndustry: false,
      isNotify: true,
      industry: {
        profession: '',
        company: '',
        jobTitle: '',
      },
    })

    const error = computed(() => store.auth.isErrored && store.auth.error!)

    const onSubmit = async () => {
      await store.auth.register({
        first: state.first,
        last: state.last,
        gender: state.gender!,
        email: state.email,
        password: state.password,
        dob: state.dob,
        industry: state.isIndustry ? { ...state.industry } : undefined,
        reminders: state.isNotify ? [ReminderFreq.HOUR] : undefined,
      })

      if (!error.value) {
        router.push('/home')
      } else {
        window.scroll({ top: 0, behavior: 'smooth' })
      }
    }

    onBeforeMount(() => {
      // Clear residual errors from login.
      store.auth.setStatus(StateStatus.WAITING)
    })

    return {
      ...toRefs(state),
      error,
      genders,
      onSubmit,
    }
  },
  head: {
    title: 'Registration',
  },
})
</script>

<style lang="scss" scoped>
.fill-calc {
  height: calc(100% - 64px);
}
</style>
