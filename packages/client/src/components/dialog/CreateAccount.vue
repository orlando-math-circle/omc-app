<template>
  <DialogForm ref="dialog" @form:submit="onSubmit">
    <template #title>Create Account</template>

    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }" />
    </template>

    <template #form>
      <v-row>
        <v-col cols="6">
          <VTextFieldValidated
            v-model="first"
            label="First Name"
            rules="required"
            required
          />
        </v-col>

        <v-col cols="6">
          <VTextFieldValidated
            v-model="last"
            label="Last Name"
            rules="required"
            required
          />
        </v-col>

        <v-col cols="12">
          <BirthdayPickerValidated
            v-model="dob"
            :min-age="18"
            :custom-messages="{
              min_age: 'Primary account users must be 18 years old.',
            }"
          />
        </v-col>

        <v-col cols="12">
          <VTextFieldValidated
            v-model="email"
            label="Email"
            rules="required|email"
            required
          />
        </v-col>

        <v-col cols="12">
          <VTextFieldValidated
            v-model="omcEmail"
            label="OMC Email (Optional)"
            rules="email"
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
          />
        </v-col>

        <v-col cols="12">
          <VTextFieldValidated
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            autocomplete="new-password"
            rules="required|password:@password"
          />
        </v-col>

        <v-col cols="12">
          <VSelectValidated
            v-model="gender"
            :items="GenderItems"
            label="Gender"
            rules="required"
          />
        </v-col>

        <v-col cols="12">
          <VSelectValidated
            v-model="grade"
            :items="EducationItems"
            label="Grade (Optional)"
            clearable
          />
        </v-col>

        <v-col cols="12">
          <VSelectValidated
            v-model="roles"
            rules="required"
            :items="RoleItems"
            label="Roles"
            multiple
          />
        </v-col>

        <v-col cols="12">
          <VSelectValidated
            v-model="reminders"
            :items="ReminderItems"
            label="Event Reminders"
            multiple
          />
        </v-col>

        <v-expand-transition>
          <v-col v-show="isIndustry">
            <v-row>
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
            </v-row>
          </v-col>
        </v-expand-transition>

        <v-col cols="12">
          <VCheckboxValidated
            v-model="isIndustry"
            label="Industry Professional"
            hide-details="auto"
          />

          <VCheckboxValidated
            v-model="emailVerified"
            label="Email Verified"
            hide-details="auto"
          />

          <VCheckboxValidated
            v-model="feeWaived"
            label="Fee Waived"
            hint="Allows the user to register to events without requiring payment"
            hide-details="auto"
          />
        </v-col>
      </v-row>
    </template>

    <template #actions>
      <v-spacer />

      <v-btn type="submit" color="primary">Create</v-btn>
    </template>
  </DialogForm>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from '@nuxtjs/composition-api'
import { useStateReset } from '@/composables/useStateReset'
import {
  Roles,
  roles as RoleItems,
  Grade,
  Gender,
  genders as GenderItems,
  EducationItems,
  reminders as ReminderItems,
  ReminderFreq,
} from '@/utils/constants'
import { useAccount } from '~/stores'
import DialogForm from '~/components/dialog/Form.vue'
import { useSnackbar } from '~/composables'

export default defineComponent({
  setup(_, { emit }) {
    const dialog = ref<InstanceType<typeof DialogForm>>()
    const accountStore = useAccount()
    const snackbar = useSnackbar()
    const isIndustry = ref(false)

    const { state, reset } = useStateReset({
      first: '',
      last: '',
      email: '',
      password: '',
      confirmPassword: '' as string | undefined,
      emailVerified: true,
      omcEmail: '',
      gender: Gender.MALE,
      roles: [Roles.DEFAULT],
      feeWaived: false,
      grade: null as Grade | null,
      dob: '',
      reminders: [ReminderFreq.HOUR],
      industry: {
        profession: '',
        company: '',
        jobTitle: '',
      },
    })

    const onSubmit = async () => {
      const { industry, grade, ...data } = state

      delete data.confirmPassword

      await accountStore.create({
        ...data,
        grade: grade || undefined,
        industry: isIndustry && industry,
      })

      if (accountStore.error) {
        snackbar.error(accountStore.error.message)
      } else {
        snackbar.success('Account Created')
        emit('create:account')
        reset()
        dialog.value?.close()
        dialog.value?.resetValidation()
      }
    }

    return {
      ...toRefs(state),
      dialog,
      onSubmit,
      reset,
      isIndustry,
      RoleItems,
      EducationItems,
      ReminderItems,
      GenderItems,
    }
  },
})
</script>
