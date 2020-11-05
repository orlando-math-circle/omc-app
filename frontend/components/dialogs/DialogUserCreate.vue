<template>
  <v-dialog v-model="dialog" max-width="440px">
    <template #activator="{ on, attrs }">
      <slot v-bind="{ on, attrs }"></slot>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-card-title>Add User</v-card-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form-validated v-slot="{ passes }" @submit:form="onSubmit">
        <v-card-text>
          <v-row>
            <v-col class="py-0">
              <v-text-field-validated
                v-model="dto.first"
                label="First Name"
                rules="required"
                required
                outlined
              ></v-text-field-validated>
            </v-col>

            <v-col class="py-0">
              <v-text-field-validated
                v-model="dto.last"
                label="Last Name"
                rules="required"
                required
                outlined
              >
              </v-text-field-validated>
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

          <v-checkbox
            v-show="!occupation.professional"
            v-model="occupation.student"
            label="Are they a student?"
          ></v-checkbox>

          <v-expand-transition>
            <div v-show="occupation.student">
              <v-select-validated
                v-model="occupation.education"
                label="Education Level"
                :items="Object.keys(educationLevels)"
                :rules="{ required: occupation.student }"
                outlined
              ></v-select-validated>

              <v-select-validated
                v-model="occupation.educationLevel"
                :label="
                  occupation.education === 'College'
                    ? 'Level of Study'
                    : 'Grade Level'
                "
                :items="educationLevels[occupation.education]"
                :rules="{ required: occupation.student }"
                outlined
              ></v-select-validated>

              <v-text-field-validated
                v-model="occupation.institution"
                label="School Name"
                hint="Enter the name of your school or institution."
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

          <v-btn
            type="submit"
            :disabled="!passes"
            :loading="isLoading"
            color="secondary"
          >
            Create User
          </v-btn>
        </v-card-actions>
      </v-form-validated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { CreateUserDto } from '../../../backend/src/user/dtos/create-user.dto'

@Component
export default class DialogUserCreate extends Vue {
  dialog = false

  dto = {
    first: '',
    last: '',
    dob: '',
    email: '',
  }

  occupation = {
    student: false,
    professional: false,
    education: 'Middle School' as keyof this['educationLevels'],
    educationLevel: 0,
    institution: '',
  }

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

  get isLoading() {
    return this.$accessor.users.isLoading || this.$accessor.auth.isLoading
  }

  async onSubmit() {
    const dto: CreateUserDto = {
      first: this.dto.first,
      last: this.dto.last,
      dob: this.dto.dob,
      email: this.dto.email.length ? this.dto.email : undefined,
      grade: this.occupation.student
        ? this.occupation.educationLevel
        : undefined,
    }

    await this.$accessor.users.create(dto)
    await this.$accessor.auth.getAccount()

    if (this.$accessor.users.error) {
      console.error(this.$accessor.users.error)
      return
    }

    this.dialog = false
  }
}
</script>
