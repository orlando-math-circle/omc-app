<template>
  <div>
    <AdminHeader title="Edit Job" :breadcrumbs="breadcrumbs">
      <v-menu offset-y transition="slide-y-transition">
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" color="primary" v-on="on">
            Actions <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list dense nav>
          <DialogConfirm @confirm="onDelete">
            <template #activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-icon>
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <span>Are you sure you wish to delete this volunteer job?</span>
          </DialogConfirm>
        </v-list>
      </v-menu>
    </AdminHeader>

    <v-row v-if="job">
      <v-col cols="12">
        <VFormValidated @form:submit="onSubmit">
          <v-card>
            <v-card-title>Information</v-card-title>

            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <VTextFieldValidated
                    v-model="job.name"
                    label="Name"
                    rules="required"
                    hide-details="auto"
                    outlined
                  />
                </v-col>

                <v-col cols="12">
                  <VTextareaValidated
                    v-model="job.description"
                    label="Description (Optional)"
                    rules="required"
                    hide-details="auto"
                    outlined
                  />
                </v-col>

                <v-col cols="12">
                  <VTextFieldValidated
                    v-model="job.hours"
                    type="tel"
                    outlined
                    hide-details="auto"
                    label="Volunteer Hours"
                    persistent-hint
                  />
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-spacer />

              <v-btn text @click="refresh">Reset</v-btn>
              <v-btn
                :disabled="!Object.keys(changes).length"
                :loading="isLoading"
                color="primary"
                type="submit"
              >
                Save Changes
              </v-btn>
            </v-card-actions>
          </v-card>
        </VFormValidated>
      </v-col>

      <!-- Project -->
      <!-- <v-col cols="12">
        <v-card>
          <v-card-title>Project Events</v-card-title>

          <data-table-events :events="project.events" />
        </v-card>
      </v-col> -->
    </v-row>
  </div>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash'
import { UpdateJobDto } from '@server/volunteer-job/dto/update-job.dto'
import { shallowDiff } from '@/utils/utilities'
import {
  computed,
  defineComponent,
  ref,
  useRoute,
  useRouter,
  useFetch,
} from '@nuxtjs/composition-api'
import { JobEntity, useJobs } from '@/stores'
import { useSnackbar } from '@/composables'

export default defineComponent({
  layout: 'admin',
  setup() {
    const job = ref<JobEntity | null>()
    const route = useRoute()
    const router = useRouter()
    const jobStore = useJobs()
    const snackbar = useSnackbar()

    const isLoading = computed(() => jobStore.isLoading)

    const changes = computed(() => {
      if (!job.value) return {}

      const dto: UpdateJobDto = {
        name: job.value.name,
        description: job.value.description,
        hours: job.value.hours,
      }

      return shallowDiff(jobStore.job!, dto)
    })

    useFetch(async () => {
      await jobStore.findOne(+route.value.params.id)

      job.value = cloneDeep(jobStore.job)
    })

    const breadcrumbs = [
      {
        text: 'Dashboard',
        href: '/admin/',
      },
      {
        text: 'Jobs',
        href: '/admin/volunteers/jobs',
      },
      {
        text: 'Edit Job',
      },
    ]

    /**
     * Reloads the job
     */
    const refresh = async (load = true) => {
      if (load) {
        await jobStore.findOne(+route.value.params.id)
      }

      job.value = cloneDeep(jobStore.job)
    }

    /**
     * Deletes the active job.
     */
    const onDelete = async () => {
      await jobStore.delete(job.value!.id)

      if (jobStore.error) {
        return snackbar.error('Failed to delete job :(')
      }

      snackbar.success('Job Deleted')

      router.push('/admin/volunteers/jobs')
    }

    const onSubmit = async () => {
      await jobStore.update(job.value!.id, changes.value)

      if (jobStore.error) {
        return snackbar.error(jobStore.error.message)
      }

      snackbar.success('Job Updated!')

      await refresh(false)
    }

    return { job, changes, breadcrumbs, isLoading, onDelete, onSubmit, refresh }
  },
  head: {
    title: 'Edit Job',
  },
})
</script>
