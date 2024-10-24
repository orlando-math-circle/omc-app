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
            <NuxtLink class="pl-2" to="/login">Log in</NuxtLink>
          </span>

          <AlertError
            v-if="error && error.status !== 409"
            :error="error"
            class="mt-3"
          />

          <VFormValidated ref="form" @form:submit="onSubmit">
            <v-row>
              <v-col cols="6">
                <VTextFieldValidated
                  v-model="first"
                  rules="required"
                  label="First Name"
                  outlined
                />
              </v-col>

              <v-col cols="6">
                <VTextFieldValidated
                  v-model="last"
                  rules="required"
                  label="Last Name"
                  outlined
                />
              </v-col>

              <v-col>
                <BirthdayPickerValidated v-model="dob" />
              </v-col>

              <v-col cols="12">
                <VSelectValidated
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
                </VSelectValidated>
              </v-col>

              <v-col cols="12">
                <VTextFieldValidated
                  v-model="email"
                  name="Email"
                  vid="email"
                  rules="required|email"
                  autocomplete="email"
                  label="Email"
                  outlined
                />
              </v-col>

              <v-col cols="12">
                <VTextFieldValidated
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
                <VTextFieldValidated
                  v-model="passwordConfirm"
                  label="Confirm Password"
                  type="password"
                  autocomplete="new-password"
                  rules="required|password:@password"
                  outlined
                />
              </v-col>

              <v-col cols="12">
                <VCheckboxValidated
                  v-model="isIndustry"
                  label="Are you an industry professional?"
                />
              </v-col>

              <v-expand-transition>
                <div v-show="isIndustry" class="mt-3">
                  <v-col cols="12">
                    <VTextFieldValidated
                      v-model="industry.profession"
                      label="Profession (Optional)"
                      outlined
                    />
                  </v-col>

                  <v-col cols="12">
                    <VTextFieldValidated
                      v-model="industry.jobTitle"
                      label="Job Title (Optional)"
                      outlined
                    />
                  </v-col>

                  <v-col cols="12">
                    <VTextFieldValidated
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
              />

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
          </VFormValidated>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeUnmount,
  reactive,
  ref,
  toRefs,
  useRouter,
} from '@nuxtjs/composition-api'
import VFormValidated from '@/components/inputs/VFormValidated.vue'
import { Gender } from '@server/user/enums/gender.enum'
import { ReminderFreq } from '@server/user/enums/reminder-freq.enum'
import { useAuth } from '@/stores'
import { genders } from '@/utils/constants'

export default defineComponent({
  layout: 'landing',
  setup() {
    const router = useRouter()
    const authStore = useAuth()

    const form = ref<InstanceType<typeof VFormValidated>>()

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

    /**
     * The `Login` and `Register` pages don't fetch anything
     * which would clear the auth store error, so they can
     * cross-pollute each other with errors.
     */
    onBeforeUnmount(() => (authStore.error = null))

    const onSubmit = async () => {
      await authStore.register({
        first: state.first,
        last: state.last,
        gender: state.gender!,
        email: state.email,
        password: state.password,
        dob: state.dob as unknown as Date,
        industry: state.isIndustry ? { ...state.industry } : undefined,
        reminders: state.isNotify ? [ReminderFreq.HOUR] : undefined,
      })

      if (authStore.error) {
        // Conflict - Email already registered
        if (authStore.error.status === 409) {
          form.value?.observer?.setErrors({
            email: 'An account with this email already exists.',
          })
        } else {
          window.scroll({ top: 0, behavior: 'smooth' })
        }
      } else {
        router.push('/home')
      }
    }

    return {
      form,
      ...toRefs(state),
      error: authStore.error,
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
