<template>
  <dialog-form ref="dialog" @submit:form="onSubmit" @dialog:close="reset">
    <template #title>Create User</template>

    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }"></slot>
    </template>

    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-text-field-validated
            v-model="first"
            label="First Name"
            rules="required"
            required
          />
        </v-col>

        <v-col cols="6">
          <v-text-field-validated
            v-model="last"
            label="Last Name"
            rules="required"
            hide-details="auto"
            required
            outlined
          />
        </v-col>

        <v-col cols="12">
          <birthday-picker-validated
            v-model="dob"
            :min-age="0"
            :max-age="100"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field-validated
            v-model="email"
            label="Email (Optional)"
            rules="email"
            type="email"
            name="Email"
            hide-details="auto"
            outlined
          />
        </v-col>

        <v-expand-transition>
          <v-col v-show="email && email.length" cols="12">
            <v-select
              v-model="reminderFreq"
              label="Event Email Reminders (Optional)"
              :items="reminders"
              hide-details="auto"
              chips
              multiple
              clearable
              outlined
            />
          </v-col>
        </v-expand-transition>

        <v-col cols="12">
          <v-select
            v-model="gender"
            label="Gender"
            :items="genders"
            hide-details="auto"
            outlined
          />
        </v-col>

        <v-col cols="12">
          <v-checkbox
            v-show="!industry.professional"
            v-model="industry.student"
            persistent-hint
            dense
            hint="Only students can register for events."
            label="Are they a student?"
          />
        </v-col>

        <v-expand-transition>
          <v-col v-show="industry.student">
            <v-row>
              <v-col cols="6">
                <v-select-validated
                  v-model="industry.education"
                  label="Education Level"
                  :items="Object.keys(education)"
                  :rules="{ required: industry.student }"
                  outlined
                />
              </v-col>

              <v-col cols="6">
                <v-select-validated
                  v-model="grade"
                  :label="
                    industry.education === 'College'
                      ? 'Level of Study'
                      : 'Grade Level'
                  "
                  :items="education[industry.education]"
                  :rules="{ required: industry.student }"
                  outlined
                />
              </v-col>

              <v-col cols="12">
                <v-text-field-validated
                  v-model="industry.institution"
                  label="School Name"
                  hint="Enter the name of their school or institution."
                  :rules="{ required: industry.student }"
                  outlined
                />
              </v-col>
            </v-row>
          </v-col>
        </v-expand-transition>

        <v-col cols="12">
          <v-checkbox
            v-show="!industry.student"
            v-model="industry.professional"
            dense
            label="Are they an industry professional?"
          />
        </v-col>

        <v-expand-transition>
          <v-col v-show="industry.professional">
            <v-row>
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
            </v-row>
          </v-col>
        </v-expand-transition>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-btn text @click="dialog && dialog.close()">Cancel</v-btn>

      <v-spacer />

      <v-btn type="submit" :loading="isLoading" color="primary">
        <v-scroll-x-transition>
          <v-icon v-if="success" class="mr-2" color="success">
            mdi-check
          </v-icon>
        </v-scroll-x-transition>
        Save
      </v-btn>
    </v-card-actions>
  </dialog-form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  toRefs,
  useContext,
} from '@nuxtjs/composition-api'
import { CreateUserDto } from '@server/user/dtos/create-user.dto'
import { ReminderFreq } from '@server/user/enums/reminder-freq.enum'
import { Gender } from '@server/user/enums/gender.enum'
import { Grade } from '@server/user/enums/grade.enum'
import { education, genders, reminders } from '~/utils/constants'
import useStateReset from '~/composables/useStateReset'
import { grades } from '~/utils/events'
import DialogForm from '~/components/dialog/Form.vue'

export default defineComponent({
  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { $accessor: store, $snack } = useContext()
    const dialog = ref<InstanceType<typeof DialogForm>>()

    const { state, reset } = useStateReset({
      success: false,
      first: '',
      last: '',
      dob: '',
      email: '' as string | null,
      gender: Gender.MALE,
      grade: null as Grade | null,
      reminderFreq: [ReminderFreq.HOUR],
      industry: {
        student: false,
        professional: false,
        education: 'Middle School' as keyof typeof education,
        educationLevel: 0,
        institution: '', // NYI
        profession: '',
        jobTitle: '',
        company: '',
      },
    })

    const isLoading = computed(
      () => store.users.isLoading || store.auth.isLoading
    )

    const onSubmit = async () => {
      const dto: CreateUserDto = Object.assign(
        {
          first: state.first,
          last: state.last,
          dob: state.dob,
          gender: state.gender,
        },
        state.email?.length && { email: state.email },
        state.email?.length &&
          state.reminderFreq.length && {
            reminders: state.reminderFreq,
          },
        state.grade && { grade: state.grade },
        state.industry.student && { grade: state.grade },
        state.industry.professional && {
          industry: {
            profession: state.industry.profession,
            company: state.industry.company,
            jobTitle: state.industry.jobTitle,
          },
        }
      )

      await store.users.create(dto)
      await store.auth.getAccount()

      if (store.users.isErrored) {
        console.error(store.users.error)
        return
      }

      state.success = true

      $snack('User successfully created')
      dialog.value!.close(500)
    }

    return {
      ...toRefs(state),
      dialog,
      genders,
      grades,
      education,
      reminders,
      isLoading,
      reset,
      onSubmit,
    }
  },
})
</script>
