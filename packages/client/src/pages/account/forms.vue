<template>
  <div>
    <v-card v-if="$accessor.auth.isVolunteer" class="mb-4">
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
          >
            Submit Request
          </v-btn>
        </v-card-actions>
      </v-form-validated>
    </v-card>

    <v-card>
      <v-card-title>Reduced Lunch Form</v-card-title>
      <v-card-subtitle>
        Sudents on their school's free lunch program will have their
        registration fees waived. Attach a copy of a letter from the student's
        school district indicating they are on the free lunch program for
        approval.
      </v-card-subtitle>

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
                <v-file-input-validated
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
import { User } from '@server/user/user.entity'
import { VolunteerWorkStatus } from '@server/volunteer-work/enums/work-status.enum'
import {
  computed,
  defineComponent,
  ref,
  useContext,
} from '@nuxtjs/composition-api'
import { FileAttachment } from '../../../../server/src/file-attachment/file-attachment.entity'
import useStateReset from '../../composables/useStateReset'

export default defineComponent({
  transition: 'slide-right',
  setup() {
    const { $accessor: store, $snack } = useContext()

    const file = ref<File>()
    const selectedUser = ref<User>()
    const { state: work, reset } = useStateReset({
      project: undefined as number | undefined,
      hours: 0,
      status: VolunteerWorkStatus.PENDING,
      notes: '',
    })

    const attachments = computed(() => store.files.attachments)
    const user = computed(() => store.auth.user!)

    const usersWithoutForms = computed(() =>
      store.auth.accountUsers.filter(
        (u) => !attachments.value.find((a) => a.user.id === u.id)
      )
    )

    const onCancel = async (attachment: FileAttachment) => {
      await store.files.deleteAttachment(attachment.id)
    }

    const submitWork = async () => {
      await store.volunteers.createWork({
        ...work,
        user: user.value.id,
      })

      if (store.volunteers.isErrored) {
        return $snack('Error while creating new work :(')
      }

      $snack('Work request submitted')
      reset()
    }

    const upload = async () => {
      await store.files.uploadAttachment({
        file: file.value!,
        field: 'REDUCED_LUNCH_FIELD',
      })

      if (store.files.isErrored) {
        $snack(store.files.error!.message)
      } else {
        selectedUser.value = undefined
      }
    }

    return {
      file,
      work,
      selectedUser,
      attachments,
      usersWithoutForms,
      submitWork,
      onCancel,
      upload,
      isVolunteer: computed(() => store.auth.isVolunteer),
    }
  },
  head: {
    title: 'Account Forms',
  },
})
</script>
