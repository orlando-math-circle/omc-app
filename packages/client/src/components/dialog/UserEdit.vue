<template>
  <v-dialog v-model="dialog" max-width="440px">
    <v-card v-if="user == null">
      <v-card-title>Error</v-card-title>

      <v-card-text>User not found.</v-card-text>
    </v-card>

    <v-card v-else>
      <v-toolbar flat>
        <v-card-title>Edit User</v-card-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form-validated v-slot="{ passes }" @submit:form="onSubmit">
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-text-field-validated
                v-model="dto.first"
                label="First Name"
                rules="required"
                hide-details="auto"
                required
                outlined
              ></v-text-field-validated>
            </v-col>

            <v-col cols="6">
              <v-text-field-validated
                v-model="dto.last"
                label="Last Name"
                rules="required"
                hide-details="auto"
                required
                outlined
              >
              </v-text-field-validated>
            </v-col>

            <v-col cols="12" class="py-0">
              <birthday-picker v-model="dto.dob" outlined></birthday-picker>
            </v-col>

            <v-col cols="6">
              <v-select-validated
                v-model="dto.gender"
                :items="genders"
                label="Gender"
                rules="required"
                outlined
                hide-details="auto"
              ></v-select-validated>
            </v-col>

            <v-col cols="6">
              <v-select-validated
                v-model="dto.grade"
                :items="grades"
                label="Grade"
                hide-details="auto"
                outlined
              ></v-select-validated>
            </v-col>

            <v-col cols="12">
              <v-text-field-validated
                v-model="dto.industry.profession"
                label="Profession (Optional)"
                hide-details="auto"
                outlined
              ></v-text-field-validated>
            </v-col>

            <v-col cols="12">
              <v-text-field-validated
                v-model="dto.industry.jobTitle"
                label="Job Title (Optional)"
                hide-details="auto"
                outlined
              ></v-text-field-validated>
            </v-col>

            <v-col cols="12">
              <v-text-field-validated
                v-model="dto.industry.company"
                label="Company or Workplace (Optional)"
                hide-details="auto"
                outlined
              ></v-text-field-validated>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            type="submit"
            :disabled="!passes"
            :loading="isLoading"
            color="secondary"
          >
            Edit User
          </v-btn>
        </v-card-actions>
      </v-form-validated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { IndustryDto } from '@omc/server/user/dtos/industry.dto'
import { Gender } from '@omc/server/user/enums/gender.enum'
import { User } from '@omc/server/user/user.entity'
import { Grade } from '@omc/server/user/enums/grade.enum'
import { Component, Vue } from 'nuxt-property-decorator'
import { genders } from '../../utils/constants'
import { grades } from '../../utils/events'

@Component
export default class DialogUserEdit extends Vue {
  user = null as User | null
  dialog = false
  genders = genders
  grades = grades

  dto = {
    first: '',
    last: '',
    dob: '',
    gender: undefined as Gender | undefined,
    grade: undefined as Grade | undefined,
    email: '' as string | undefined,
    industry: {
      profession: '',
      jobTitle: '',
      company: '',
    } as IndustryDto,
  }

  get isLoading() {
    return this.$accessor.users.isLoading || this.$accessor.auth.isLoading
  }

  public open(user: User) {
    if (!user) return

    this.user = user
    this.dto.first = user.first
    this.dto.last = user.last
    this.dto.dob = (user.dob as unknown) as string
    this.dto.email = user.email
    this.dto.gender = user.gender
    this.dto.grade = user.grade

    if (user.industry) {
      this.dto.industry = { ...user.industry }
    }

    this.dialog = true
  }

  async onSubmit() {
    await this.$accessor.users.update({
      id: this.user!.id,
      updateUserDto: this.dto,
    })

    if (!this.$accessor.users.error) {
      if (this.$accessor.auth.user!.id === this.user!.id) {
        await this.$accessor.auth.getMe()
      }
      await this.$accessor.auth.getAccount()

      this.dialog = false
    }
  }
}
</script>
