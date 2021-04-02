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

      <v-form-validated v-slot="{ passes }" @submit:form="onSubmit">
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
      </v-form-validated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { CreateJobDto } from '@omc/server/volunteer-job/dto/create-job.dto'
import { CreateProjectDto } from '@omc/server/project/dto/create-project.dto'
import { Nullable } from '~/interfaces/nullable.type'
import { Uploads } from '~/interfaces/uploads.interface'

@Component
export default class DialogCreateProject extends Vue {
  dialog = false
  project: number | null = null
  jobs: CreateJobDto[] = []
  files: Uploads = null
  dto: Nullable<CreateProjectDto> = {
    name: null,
    description: null,
    picture: null,
  }

  get projects() {
    return this.$accessor.projects.projects
  }

  get error() {
    return this.$accessor.projects.error
  }

  get isLoading() {
    return this.$accessor.files.isLoading || this.$accessor.projects.isLoading
  }

  onCreateJob(job: CreateJobDto) {
    this.jobs.push(job)
  }

  async onSubmit() {
    // Type asserted as this is not multi-file upload.
    const url = (await this.$accessor.files.filesToURL(this.files)) as
      | string
      | null

    if (this.$accessor.files.error) {
      console.error(this.$accessor.files.error)
    }

    const project = await this.$accessor.projects.create(
      Object.assign(
        {
          ...(this.dto as CreateProjectDto),
        },
        url && { picture: url },
        this.jobs.length && { jobs: this.jobs }
      )
    )

    if (!this.error) {
      this.$emit('create:project', project)
      this.dialog = false
    }
  }
}
</script>
