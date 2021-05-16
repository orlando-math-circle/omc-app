<template>
  <v-dialog v-model="dialog" max-width="440">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-tooltip bottom>
          <template #activator="tooltip">
            <v-btn
              v-bind="{ ...attrs, ...tooltip.attrs }"
              large
              icon
              v-on="{ ...on, ...tooltip.on }"
            >
              <v-icon>mdi-folder-plus-outline</v-icon>
            </v-btn>
          </template>

          <span>Create Project</span>
        </v-tooltip>
      </slot>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title>Create Project</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-toolbar>

      <VFormValidated v-slot="{ passes }" @submit:form="onSubmit">
        <v-card-text>
          <alert-error v-if="error" :error="error" />

          <v-row>
            <v-col cols="12">
              <v-text-field-validated
                v-model="dto.name"
                label="Name"
                rules="required"
                hide-details="auto"
                required
                outlined
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="dto.description"
                label="Description"
                hide-details="auto"
                outlined
              />
            </v-col>

            <v-col cols="12">
              <file-upload
                v-model="files"
                label="Upload Image (Optional)"
                endpoint="/file"
                hide-details="auto"
                outlined
                chips
              />
            </v-col>

            <v-col>
              <v-row>
                <v-col>
                  <div class="title">Volunteer Jobs</div>

                  <span v-if="!jobs.length">No jobs</span>

                  <v-chip-group column>
                    <template v-for="(job, i) in jobs">
                      <v-chip
                        :key="job.name + i"
                        close
                        @click:close="jobs.splice(i, 1)"
                      >
                        {{ job.name }}
                      </v-chip>
                    </template>
                  </v-chip-group>
                </v-col>

                <v-col cols="auto" class="align-self-center"> </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <dialog-create-job @create:job="onCreateJob">
            <template #activator="{ on, attrs }">
              <v-btn text v-bind="attrs" v-on="on">Create Job</v-btn>
            </template>
          </dialog-create-job>

          <v-spacer></v-spacer>

          <v-btn
            text
            type="submit"
            :disabled="!passes"
            :loading="isLoading"
            color="secondary"
          >
            Create
          </v-btn>
        </v-card-actions>
      </VFormValidated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { CreateJobDto } from '@server/volunteer-job/dto/create-job.dto'
import { CreateProjectDto } from '@server/project/dto/create-project.dto'
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
} from '@nuxtjs/composition-api'
import { useProjects } from '@/store/useProjects'
import { useFiles } from '@/store/useFiles'
import { useSnackbar } from '@/composables/useSnackbar'
import { Nullable } from '@/types/nullable.type'

export default defineComponent({
  setup(_, { emit }) {
    const state = reactive({
      dialog: false,
      project: null as number | null,
      jobs: [] as CreateJobDto[],
      file: null as File | null,
      dto: {
        name: null,
        description: null,
        picture: null,
      } as Nullable<CreateProjectDto>,
    })

    const snackbar = useSnackbar()
    const projectStore = useProjects()
    const fileStore = useFiles()

    const projects = computed(() => projectStore.projects)
    const isLoading = computed(() => projectStore.isLoading)

    const onCreateJob = (job: CreateJobDto) => state.jobs.push(job)

    const onSubmit = async () => {
      const file = await fileStore.create(state.file!)

      if (fileStore.error) {
        snackbar.error(fileStore.error.message)
      }

      const project = await projectStore.create({
        ...state.dto,
        ...(file && { picture: file.root }),
        ...(state.jobs.length && { jobs: state.jobs }),
      })

      if (!projectStore.error) {
        emit('create:project', project)
        state.dialog = false
      }
    }

    return { ...toRefs(state), projects, isLoading, onCreateJob, onSubmit }
  },
})
</script>
