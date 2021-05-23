<template>
  <div>
    <admin-header title="Edit Project" :breadcrumbs="breadcrumbs">
      <v-menu offset-y transition="slide-y-transition">
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" color="primary" v-on="on">
            Actions <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list dense nav>
          <DialogCreateJob @create:job="onCreateJob">
            <template #activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-icon>
                  <v-icon>mdi-briefcase-plus-outline</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Add Job</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </DialogCreateJob>

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

            <span>Are you sure you wish to delete this project?</span>
          </DialogConfirm>
        </v-list>
      </v-menu>
    </admin-header>

    <v-row v-if="project">
      <v-col cols="12">
        <v-card>
          <v-card-title>Information</v-card-title>

          <VFormValidated @submit:form="onSubmit">
            <v-card-text>
              <v-row>
                <v-expand-transition>
                  <v-col v-if="background" cols="12">
                    <v-img
                      :src="background"
                      class="rounded"
                      max-height="100"
                      cover
                    />
                  </v-col>
                </v-expand-transition>

                <v-col cols="12">
                  <VTextFieldValidated
                    v-model="project.name"
                    label="Name"
                    rules="required"
                    hide-details="auto"
                    outlined
                  />
                </v-col>

                <v-col cols="12">
                  <VTextareaValidated
                    v-model="project.description"
                    label="Description"
                    rules="required"
                    hide-details="auto"
                    outlined
                  />
                </v-col>

                <v-col cols="12">
                  <FileUpload
                    v-model="project.picture"
                    outlined
                    hide-details="auto"
                    label="Picture (Optional)"
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
          </VFormValidated>
        </v-card>
      </v-col>

      <!-- Jobs -->
      <v-col cols="12">
        <v-card>
          <v-card-title>Project Jobs</v-card-title>

          <DataTableJobs :jobs="jobs" />
        </v-card>
      </v-col>

      <!-- Events -->
      <v-col cols="12">
        <v-card>
          <v-card-title>Project Events</v-card-title>

          <DataTableEvents :events="project.events" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash'
import { Project } from '@server/project/project.entity'
import { UpdateProjectDto } from '@server/project/dto/update-project.dto'
import { CreateJobDto } from '@server/volunteer-job/dto/create-job.dto'
import { shallowDiff } from '@/utils/utilities'
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useFetch,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import { useProjects, useJobs } from '@/stores'
import { useSnackbar } from '@/composables'

export default defineComponent({
  layout: 'admin',
  setup() {
    const { $config } = useContext()
    const route = useRoute()
    const router = useRouter()
    const projectStore = useProjects()
    const jobStore = useJobs()
    const snackbar = useSnackbar()

    const project = ref<Project | null>(null)

    const isLoading = computed(() => projectStore.isLoading)
    const jobs = computed(() => project.value?.jobs || [])
    const background = computed(() => {
      if (typeof project.value?.picture !== 'string') return null

      const url = project.value.picture

      if (url.startsWith('http')) return url

      return `${$config.staticBase}${url}`
    })
    const changes = computed(() => {
      if (!project.value) return {}

      const dto: UpdateProjectDto = {
        name: project.value.name,
        description: project.value.description,
        picture: project.value.picture,
      }

      return shallowDiff(projectStore.project!, dto)
    })

    const onDelete = async () => {
      await projectStore.delete(+route.value.params.id)

      if (projectStore.error) {
        return snackbar.error(projectStore.error.message)
      }

      snackbar.success('Project Deleted')

      router.push('/admin/calendar/projects')
    }

    const onCreateJob = async (job: CreateJobDto) => {
      await jobStore.create({
        ...job,
        ...{ project: project.value!.id },
      })

      if (jobStore.error) {
        snackbar.error(jobStore.error.message)
      } else {
        snackbar.success('Job Added')

        await refresh()
      }
    }

    const refresh = async (load = true) => {
      if (load) {
        await projectStore.findOne(+route.value.params.id)
      }

      project.value = cloneDeep(projectStore.project)
    }

    useFetch(async () => await refresh())

    const breadcrumbs = [
      {
        text: 'Dashboard',
        href: '/admin/',
      },
      {
        text: 'Projects',
        href: '/admin/calendar/projects',
      },
      {
        text: 'Project',
      },
    ]

    const onSubmit = () => {}

    return {
      project,
      breadcrumbs,
      isLoading,
      jobs,
      changes,
      background,
      refresh,
      onDelete,
      onCreateJob,
      onSubmit,
    }
  },
  head: {
    title: 'Edit Project',
  },
})
</script>
