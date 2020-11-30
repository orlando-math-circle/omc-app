<template>
  <div>
    <v-card v-if="isVolunteer" class="mb-4">
      <v-card-title>Submit Work Request</v-card-title>
      <v-card-subtitle>
        Submit a work order request to be approved by a staff member.
      </v-card-subtitle>

      <v-form-validated @submit:form="submitWork">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <auto-complete-project
                v-model="work.project"
                item-value="id"
                label="Project (Optional)"
                outlined
              ></auto-complete-project>
            </v-col>

            <v-col cols="12">
              <v-text-field-validated
                v-model.number="work.hours"
                rules="required"
                label="Hours"
                hint="The hours to award (or deduct)"
                outlined
                hide-details="auto"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field-validated
                v-model.number="work.notes"
                label="Notes"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            type="submit"
            :loading="$accessor.volunteers.isLoading"
            color="primary"
            >Submit Request</v-btn
          >
        </v-card-actions>
      </v-form-validated>
    </v-card>

    <v-card>
      <v-card-title>Reduced Lunch Form</v-card-title>
      <v-card-subtitle
        >Sudents on their school's free lunch program will have their
        registration fees waived. Attach a copy of a letter from the student's
        school district indicating they are on the free lunch program for
        approval.</v-card-subtitle
      >

      <v-form-validated v-slot="{ passes }">
        <v-card-text>
          <v-list v-if="attachments.length" class="mb-5">
            <template v-for="attachment in attachments">
              <v-list-item :key="attachment.id + '-attachment'">
                <v-list-item-icon>
                  <v-icon large>mdi-timer-sand</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{
                    attachment.user.name
                  }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      attachment.status === 'pending'
                        ? 'Awaiting Approval'
                        : 'Reviewed'
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon @click="onClickCancel(attachment)">
                    <v-icon>mdi-cancel</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

              <v-divider :key="attachment.id + '-divider'"></v-divider>
            </template>
          </v-list>

          <v-expand-transition>
            <div v-if="usersWithoutForms.length">
              <v-file-input-validated
                v-model="file"
                prepend-icon="mdi-paperclip"
                label="Select Document"
                rules="required|ext:doc,docx,pdf,png,jpg,jpeg"
                required
                chips
                outlined
              ></v-file-input-validated>

              <v-select-validated
                v-model="selectedUser"
                :items="usersWithoutForms"
                prepend-icon="mdi-account-circle-outline"
                label="Select User"
                rules="required"
                required
                outlined
              >
                <template #item="{ item }">
                  <v-avatar size="32px" class="mr-2">
                    <v-img :src="$avatar(item)" />
                  </v-avatar>

                  <span>{{ item.name }}</span>
                </template>

                <template #selection="{ item }">
                  <v-avatar size="32px" class="mr-2">
                    <v-img :src="$avatar(item)" />
                  </v-avatar>

                  <span>{{ item.name }}</span>
                </template>
              </v-select-validated>
            </div>
          </v-expand-transition>

          <span
            >If you require assistance feel free to bring a copy of the form
            in-person or email it to
            <a href="mailto:help@orlandomathcircle.org">
              help@orlandomathcircle.org </a
            >.</span
          >
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="!passes" color="secondary" @click="upload">
            Upload
          </v-btn>
        </v-card-actions>
      </v-form-validated>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { FileAttachment } from '../../../backend/src/file-attachment/file-attachment.entity'
import { User } from '../../../backend/src/user/user.entity'
import { VolunteerWorkStatus } from '../../../backend/src/volunteer-work/enums/work-status.enum'

@Component({
  head: {
    title: 'Account Forms',
  },
  transition: 'slide-right',
})
export default class AccountFormsPage extends Vue {
  file: null | File = null
  selectedUser: null | User = null

  work = {
    project: null as number | null,
    hours: 0,
    status: VolunteerWorkStatus.PENDING,
    notes: '',
  }

  get user() {
    return this.$accessor.auth.user!
  }

  get isVolunteer() {
    return this.$accessor.auth.isVolunteer
  }

  get accountUsers() {
    return (this.$accessor.auth.account!.users as unknown) as User[]
  }

  get attachments() {
    return this.$accessor.files.attachments
  }

  get usersWithoutForms() {
    return this.accountUsers.filter(
      (u) => !this.attachments.find((a) => a.user.id === u.id)
    )
  }

  async onClickCancel(attachment: FileAttachment) {
    await this.$accessor.files.deleteAttachment(attachment.id)
  }

  async submitWork() {
    await this.$accessor.volunteers.createWork({
      ...this.work,
      user: this.user.id,
    } as any)

    if (this.$accessor.volunteers.isErrored) {
      return this.$snack('Error while creating new work :(')
    }

    this.work.project = null
    this.work.hours = 0
    this.work.notes = ''

    this.$snack('Work request submitted')
  }

  async upload() {
    await this.$accessor.files.uploadAttachment({
      file: this.file as File,
      field: 'REDUCED_LUNCH_FIELD',
    })

    if (this.$accessor.files.isErrored) {
      this.$accessor.snackbar.show({
        text: this.$accessor.files.error!.message,
        timeout: 10000,
      })
    } else {
      this.selectedUser = null
    }
  }
}
</script>
