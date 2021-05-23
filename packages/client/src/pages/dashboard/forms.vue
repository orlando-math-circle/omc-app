<template>
  <div>
    <v-card v-if="isVolunteer" class="mb-4">
      <VFormValidated ref="workForm" @form:submit="onSubmitWork">
        <v-card-title>Submit Work Request</v-card-title>
        <v-card-subtitle>
          Submit a work order request to be approved by a staff member.
        </v-card-subtitle>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <VAutocompleteValidated
                v-model="work.project"
                :items="projectStore.projects"
                :loading="projectStore.isLoading"
                item-value="id"
                label="Project (Optional)"
                hide-details="auto"
                item-text="name"
                clearable
                outlined
                debounce
                @search="projectStore.findAll()"
              />
            </v-col>

            <v-col cols="12">
              <VTextFieldValidated
                v-model.number="work.hours"
                rules="required"
                label="Hours"
                hint="Hours of work completed"
                outlined
                hide-details="auto"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model.number="work.notes"
                label="Notes"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn type="submit" :loading="workStore.isLoading" color="primary">
            Submit Request
          </v-btn>
        </v-card-actions>
      </VFormValidated>
    </v-card>

    <!-- Reduced Lunch Form -->
    <v-card>
      <VFormValidated v-slot="{ passes }">
        <v-card-title>Reduced Lunch Form</v-card-title>
        <v-card-subtitle>
          Sudents on their school's free lunch program will have their
          registration fees waived. Attach a copy of a letter from the student's
          school district indicating they are on the free lunch program for
          approval.
        </v-card-subtitle>

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
                  <v-btn icon @click="onCancel(attachment)">
                    <v-icon>mdi-cancel</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

              <v-divider :key="attachment.id + '-divider'"></v-divider>
            </template>
          </v-list>

          <v-expand-transition>
            <v-row v-if="usersWithoutForms.length" class="mb-4">
              <v-col cols="12">
                <VFileInputValidated
                  v-model="file"
                  prepend-icon="mdi-paperclip"
                  label="Upload Document"
                  rules="required|ext:doc,docx,pdf,png,jpg,jpeg"
                  required
                  chips
                  outlined
                />
              </v-col>

              <v-col cols="12">
                <VSelectValidated
                  v-model="selectedUser"
                  :items="usersWithoutForms"
                  prepend-icon="mdi-account-circle-outline"
                  label="Select User"
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
                      <v-img :src="item.avatarUrl" />
                    </v-avatar>

                    <span>{{ item.name }}</span>
                  </template>
                </VSelectValidated>
              </v-col>
            </v-row>
          </v-expand-transition>

          <span>
            If you require assistance feel free to bring a copy of the form
            in-person or email it to
            <a href="mailto:help@orlandomathcircle.org">
              help@orlandomathcircle.org</a
            >
            .
          </span>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="!passes" color="secondary" @click="upload">
            Upload
          </v-btn>
        </v-card-actions>
      </VFormValidated>
    </v-card>
  </div>
</template>

<script lang="ts">
import { User } from '@server/user/user.entity'
import { VolunteerWorkStatus } from '@server/volunteer-work/enums/work-status.enum'
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import { FileAttachment } from '@server/file-attachment/file-attachment.entity'
import { useSnackbar, useStateReset } from '@/composables'
import { useAuth, useProjects, useWork, useAttachments } from '@/stores'
import VFormValidated from '@/components/inputs/VFormValidated.vue'

export default defineComponent({
  transition: 'slide-right',
  setup() {
    const snackbar = useSnackbar()
    const attachmentStore = useAttachments()
    const projectStore = useProjects()
    const workStore = useWork()
    const authStore = useAuth()

    const file = ref<File>()
    const selectedUser = ref<User>()
    const workForm = ref<InstanceType<typeof VFormValidated>>()

    const { state: work, reset: resetWorkState } = useStateReset({
      project: undefined as number | undefined,
      hours: 0,
      status: VolunteerWorkStatus.PENDING,
      notes: '',
    })

    const user = computed(() => authStore.user!)

    const usersWithoutForms = computed(() =>
      authStore.accountUsers.filter(
        (u) => !attachmentStore.attachments.find((a) => a.user.id === u.id)
      )
    )

    const onCancel = async (attachment: FileAttachment) => {
      await attachmentStore.delete(attachment.id)
    }

    const onSubmitWork = async () => {
      await workStore.create({ ...work, user: user.value.id })

      if (workStore.error) {
        return snackbar.error('Error while creating new work :(')
      }

      snackbar.success('Work request submitted')
      resetWorkState()
      workForm.value!.resetValidation()
    }

    const upload = async () => {
      await attachmentStore.create('REDUCED_LUNCH_FIELD', file.value!)

      if (attachmentStore.error) {
        snackbar.error(attachmentStore.error.message)
      } else {
        selectedUser.value = undefined
      }
    }

    return {
      file,
      work,
      workStore,
      authStore,
      projectStore,
      selectedUser,
      attachments: computed(() => attachmentStore.attachments),
      usersWithoutForms,
      onSubmitWork,
      onCancel,
      upload,
      isVolunteer: computed(() => authStore.isVolunteer),
      workForm,
    }
  },
  head: {
    title: 'Account Forms',
  },
})
</script>
