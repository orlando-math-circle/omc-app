<template>
  <dialog-form
    ref="dialog"
    @submit:form="onSubmit"
    @dialog:state="onDialogState"
  >
    <template #title>Create User</template>

    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }"></slot>
    </template>

    <v-card-text>
      <v-row>
        <v-col>
          <v-text-field-validated
            v-model="dto.first"
            label="First Name"
            rules="required"
            hide-details="auto"
            required
            outlined
          ></v-text-field-validated>
        </v-col>

        <v-col>
          <v-text-field-validated
            v-model="dto.last"
            label="Last Name"
            rules="required"
            hide-details="auto"
            required
            outlined
          ></v-text-field-validated>
        </v-col>
      </v-row>

      <birthday-picker
        v-model="dto.dob"
        class="mb-5"
        outlined
      ></birthday-picker>

      <v-text-field-validated
        v-model="dto.email"
        label="Email (Optional)"
        rules="email"
        type="email"
        outlined
      ></v-text-field-validated>

      <v-expand-transition>
        <v-select-validated
          v-show="dto.email && dto.email.length"
          v-model="dto.reminders"
          label="Event Email Reminders (Optional)"
          :items="reminders"
          multiple
          clearable
          outlined
        ></v-select-validated>
      </v-expand-transition>

      <v-select-validated
        v-model="dto.gender"
        label="Gender"
        :items="genders"
        outlined
      ></v-select-validated>

      <v-checkbox
        v-show="!occupation.professional"
        v-model="occupation.student"
        :persistent-hint="!occupation.student"
        hint="Only students can be registered to events"
        label="Are they a student?"
      ></v-checkbox>

      <v-expand-transition>
        <div v-show="occupation.student">
          <v-row>
            <v-col>
              <v-select-validated
                v-model="occupation.education"
                label="Education Level"
                :items="Object.keys(education)"
                :rules="{ required: occupation.student }"
                outlined
              ></v-select-validated>
            </v-col>

            <v-col>
              <v-select-validated
                v-model="dto.grade"
                :label="
                  occupation.education === 'College'
                    ? 'Level of Study'
                    : 'Grade Level'
                "
                :items="education[occupation.education]"
                :rules="{ required: occupation.student }"
                outlined
              ></v-select-validated>
            </v-col>
          </v-row>

          <v-text-field-validated
            v-model="occupation.institution"
            label="School Name"
            hint="Enter the name of their school or institution."
            :rules="{ required: occupation.student }"
            outlined
          ></v-text-field-validated>
        </div>
      </v-expand-transition>

      <v-checkbox
        v-show="!occupation.student"
        v-model="occupation.professional"
        label="Are they an industry professional?"
      ></v-checkbox>

      <v-expand-transition>
        <div v-show="occupation.professional">
          <v-text-field-validated
            label="Profession (Optional)"
            outlined
          ></v-text-field-validated>

          <v-text-field-validated
            label="Job Title (Optional)"
            outlined
          ></v-text-field-validated>

          <v-text-field-validated
            label="Company or Workplace (Optional)"
            outlined
          ></v-text-field-validated>
        </div>
      </v-expand-transition>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn text @click="dialog.close()">Cancel</v-btn>
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
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import { CreateUserDto } from '../../../backend/src/user/dtos/create-user.dto'
import { Gender } from '../../../backend/src/user/enums/gender.enum'
import { Grade } from '../../../backend/src/user/enums/grade.enum'
import { ReminderFreq } from '../../../backend/src/user/enums/reminder-freq.enum'
import { education, genders, reminders } from '../../utils/constants'
import { grades } from '../../utils/events'
import DialogForm from './DialogForm.vue'

@Component
export default class DialogUserCreate extends Vue {
  @Ref('dialog') readonly dialog!: DialogForm

  success = false
  genders = genders
  grades = grades
  education = education
  reminders = reminders
  reset = {}

  dto = {
    first: '',
    last: '',
    dob: '',
    email: '' as string | null,
    gender: Gender.MALE,
    grade: null as Grade | null,
    reminders: [] as ReminderFreq[],
  }

  occupation = {
    student: false,
    professional: false,
    education: 'Middle School' as keyof this['education'],
    educationLevel: 0,
    institution: '',
  }

  get isLoading() {
    return this.$accessor.users.isLoading || this.$accessor.auth.isLoading
  }

  /**
   * Copy the empty template so we can erase data
   * after creating a user.
   */
  beforeMount() {
    this.reset = { ...this.dto }
  }

  /**
   * When the dialog closes we should reset.
   */
  onDialogState(value: boolean) {
    if (value === false) {
      this.success = false
      this.dto = { ...this.reset } as this['dto']
    }
  }

  /**
   * Create the user.
   */
  async onSubmit() {
    const dto: CreateUserDto = Object.assign(
      {
        first: this.dto.first,
        last: this.dto.last,
        dob: this.dto.dob,
        gender: this.dto.gender,
        reminders: this.dto.reminders,
      },
      this.dto.email?.length && { email: this.dto.email },
      this.dto.email?.length &&
        this.dto.reminders.length && { reminders: this.dto.reminders },
      this.dto.grade && { grade: this.dto.grade }
    )

    await this.$accessor.users.create(dto)
    await this.$accessor.auth.getAccount()

    if (this.$accessor.users.isErrored) {
      console.error(this.$accessor.users.error)
      return
    }

    this.success = true
    this.$accessor.snackbar.show({ text: 'User successfully created' })
    this.dialog.close(500)
  }
}
</script>
