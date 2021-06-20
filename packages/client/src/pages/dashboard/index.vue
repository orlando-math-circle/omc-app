<template>
  <div>
    <v-card v-if="user.omcEmail" class="mb-4">
      <v-card-title>OMC Email</v-card-title>

      <v-card-subtitle>
        You have been given an OMC organization email.
      </v-card-subtitle>

      <v-card-text>
        <LinkCopy :text="user.omcEmail" />
      </v-card-text>
    </v-card>

    <!-- Personal User Settings -->
    <v-card class="mb-4">
      <VFormValidated
        ref="form"
        v-slot="{ dirty }"
        @form:submit="onChangeSettings"
      >
        <v-card-title>Personal Info</v-card-title>

        <v-card-subtitle>Modify your user information.</v-card-subtitle>

        <v-card-text>
          <v-row>
            <v-col cols="6">
              <VTextFieldValidated
                v-model="settings.first"
                label="First Name"
                rules="required"
              />
            </v-col>

            <v-col cols="6">
              <VTextFieldValidated
                v-model="settings.last"
                label="Last Name"
                rules="required"
              />
            </v-col>

            <v-col cols="12">
              <BirthdayPickerValidated
                v-if="isPrimaryUser"
                v-model="settings.dob"
                :custom-messages="{
                  min_age:
                    'Primary account users must be 18 years old or older.',
                }"
                :min-age="18"
              />

              <BirthdayPickerValidated
                v-else
                v-model="settings.dob"
                :min-age="0"
              />
            </v-col>

            <v-col cols="12">
              <VTextFieldValidated
                v-model="settings.email"
                label="Email"
                type="email"
                rules="required|email"
              >
                <template v-if="user.email === settings.email" #append>
                  <span v-if="user.emailVerified">
                    <v-icon>mdi-check</v-icon> Email Verified
                  </span>

                  <span v-else>
                    <v-icon>mdi-close</v-icon> Email Unverified
                  </span>
                </template>
              </VTextFieldValidated>
            </v-col>

            <v-col cols="6">
              <VSelectValidated
                v-model="settings.gender"
                :items="genders"
                label="Gender"
                rules="required"
              />
            </v-col>

            <v-col cols="6">
              <VSelectValidated
                v-model="settings.grade"
                :items="grades"
                label="Grade"
                outlined
                clearble
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-slide-x-transition>
            <v-btn v-if="dirty" text @click="onResetSettings">
              Reset Changes
            </v-btn>
          </v-slide-x-transition>

          <v-spacer />

          <v-btn :disabled="!dirty" type="submit" color="primary">
            Save Changes
          </v-btn>
        </v-card-actions>
      </VFormValidated>
    </v-card>

    <!-- Notifications Card -->
    <v-card class="mb-4">
      <v-card-title>Notifications</v-card-title>

      <v-card-subtitle>
        Change the frequency or disable reminder emails for registered events.
      </v-card-subtitle>

      <v-card-text>
        <v-select
          :value="user.reminders"
          :items="reminders"
          label="Reminders"
          multiple
          chips
          clearable
          hide-details
          outlined
          @input="handleChangeReminders"
        />
      </v-card-text>
    </v-card>

    <!-- Password Changing Card -->
    <v-card v-if="isPrimaryUser" class="mb-4">
      <VFormValidated @form:submit="onChangePassword">
        <v-card-title>Change Password</v-card-title>

        <v-card-subtitle>Change the password on the account.</v-card-subtitle>

        <v-card-text>
          <!-- Hidden, but included or accessibility reasons. -->
          <!-- https://www.chromium.org/developers/design-documents/create-amazing-password-forms -->
          <input hidden type="text" autocomplete="email" />

          <v-row>
            <v-col cols="12">
              <VTextFieldValidated
                v-model="curPassword"
                label="Original Password"
                type="password"
                rules="required"
                autocomplete="current-password"
                outlined
                hide-details="auto"
              />
            </v-col>

            <v-col cols="12">
              <VTextFieldValidated
                v-model="newPassword"
                label="New Password"
                type="password"
                rules="required"
                autocomplete="new-password"
                vid="password"
                outlined
                hide-details="auto"
              />
            </v-col>

            <v-col cols="12">
              <VTextFieldValidated
                v-model="confirm"
                label="Confirm New Password"
                type="password"
                autocomplete="new-password"
                rules="required|password:@password"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn :loading="isLoading" color="primary" type="submit">
            Change Password
          </v-btn>
        </v-card-actions>
      </VFormValidated>
    </v-card>
  </div>
</template>

<script lang="ts">
import { ReminderFreq } from '@server/user/enums/reminder-freq.enum'
import {
  computed,
  defineComponent,
  reactive,
  ref,
  toRefs,
  onMounted,
  useRoute,
} from '@nuxtjs/composition-api'
import { User } from '@server/user/user.entity'
import { useAuth, useUsers } from '@/stores'
import { useSnackbar, useStateReset } from '@/composables'
import VFormValidated from '@/components/inputs/VFormValidated.vue'
import { genders, reminders } from '@/utils/constants'
import { grades } from '@/utils/events'

type FormComponent = InstanceType<typeof VFormValidated>

export default defineComponent({
  transition: 'slide-left',
  setup() {
    const form = ref<FormComponent>()

    const route = useRoute()
    const snackbar = useSnackbar()
    const userStore = useUsers()
    const authStore = useAuth()

    const state = reactive({
      reminders: [] as ReminderFreq[],
      confirm: '',
      newPassword: '',
      curPassword: '',
    })

    const user = computed(() => authStore.user!)

    onMounted(async () => {
      const token = route.value.query['change-email']

      if (typeof token !== 'string') return

      await authStore.verifyEmailChange(token)

      if (authStore.error) {
        if (authStore.error.status === 410) {
          snackbar.success('Email already changed & validated')
        } else {
          snackbar.error('Error verifying your email')
        }
      } else {
        await authStore.getMyUser()

        setSettings({
          first: user.value.first,
          last: user.value.last,
          dob: user.value.dob,
          email: user.value.email,
          grade: user.value.grade,
          gender: user.value.gender,
        })

        snackbar.success('Email successfully changed')
      }
    })

    const {
      state: settings,
      set: setSettings,
      reset: resetSettings,
    } = useStateReset({
      first: user.value.first,
      last: user.value.last,
      dob: user.value.dob,
      email: user.value.email,
      grade: user.value.grade,
      gender: user.value.gender,
    })

    const onChangePassword = async () => {
      await authStore.changePassword({
        curPassword: state.curPassword,
        newPassword: state.newPassword,
      })

      if (authStore.error) {
        return snackbar.error(
          authStore.error.status === 400
            ? 'Current password is incorrect'
            : authStore.error.message,
          10000
        )
      }

      await authStore.getMyUser()

      state.confirm = ''
      state.curPassword = ''
      state.newPassword = ''

      snackbar.success('Successfully Updated')
    }

    const handleChangeReminders = async (reminders: ReminderFreq[]) => {
      await userStore.update(user.value.id, { reminders }, true)

      if (userStore.error) {
        snackbar.error(userStore.error.message, 10000)
      } else {
        await authStore.getMyUser()

        snackbar.success('Successfully Updated')
      }
    }

    const onResetSettings = () => {
      resetSettings()
      form.value?.resetValidation()
    }

    const onChangeSettings = async () => {
      const { email, ...other } = settings

      if (email && email !== user.value.email) {
        await authStore.requestEmailChange({ email })
      }

      await userStore.update(user.value.id, other, true)

      if (userStore.error) {
        snackbar.error(userStore.error.message)
      } else {
        await authStore.getMyUser()

        setSettings({
          first: user.value.first,
          last: user.value.last,
          dob: user.value.dob,
          email: user.value.email,
          grade: user.value.grade,
          gender: user.value.gender,
        })

        form.value?.resetValidation()

        if (email && email !== user.value.email) {
          snackbar.success('Check your inbox to verify your new email')
        } else {
          snackbar.success('Updated Successfully')
        }
      }
    }

    const gender = (user: User) =>
      genders.find((gender) => gender.value === user.gender)?.text

    return {
      ...toRefs(state),
      form,
      user,
      settings,
      genders,
      reminders,
      grades,
      isLoading: computed(() => userStore.isLoading),
      primaryUser: authStore.primaryUser,
      isPrimaryUser: authStore.isPrimaryUser,
      onChangePassword,
      handleChangeReminders,
      onChangeSettings,
      onResetSettings,
      gender,
    }
  },
  head: {
    title: 'Account Settings',
  },
})
</script>
