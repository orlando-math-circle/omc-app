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
          <dialog-create-job @create:job="onCreateJob">
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
          </dialog-create-job>

          <dialog-confirm @confirm="onDelete">
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
          </dialog-confirm>
        </v-list>
      </v-menu>
    </admin-header>

    <v-row v-if="project">
      <v-col cols="12">
        <v-card>
          <v-card-title>Information</v-card-title>

          <v-form-validated @submit:form="onSubmit">
            <v-card-text>
              <v-row>
                <v-expand-transition>
                  <v-col v-if="background" cols="12">
                    <v-img
                      :src="background"
                      class="rounded"
                      max-height="100"
                      cover
                    ></v-img>
                  </v-col>
                </v-expand-transition>

                <v-col cols="12">
                  <v-text-field-validated
                    v-model="project.name"
                    label="Name"
                    rules="required"
                    hide-details="auto"
                    outlined
                  ></v-text-field-validated>
                </v-col>

                <v-col cols="12">
                  <v-textarea-validated
                    v-model="project.description"
                    label="Description"
                    rules="required"
                    hide-details="auto"
                    outlined
                  ></v-textarea-validated>
                </v-col>

                <v-col cols="12">
                  <file-upload
                    v-model="project.picture"
                    outlined
                    hide-details="auto"
                    label="Picture (Optional)"
                    persistent-hint
                  ></file-upload>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

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
          </v-form-validated>
        </v-card>
      </v-col>

      <!-- Jobs -->
      <v-col cols="12">
        <v-card>
          <v-card-title>Project Jobs</v-card-title>

          <data-table-jobs :jobs="jobs" />
        </v-card>
      </v-col>

      <!-- Events -->
      <v-col cols="12">
        <v-card>
          <v-card-title>Project Events</v-card-title>

          <data-table-events :events="project.events" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { cloneDeep } from 'lodash'
import { Project } from '@omc/server/project/project.entity'
import { UpdateProjectDto } from '@omc/server/project/dto/update-project.dto'
import { CreateJobDto } from '@omc/server/volunteer-job/dto/create-job.dto'
import { shallowDiff } from '~/utils/utilities'

@Component({
  layout: 'admin',
  head: {
    title: 'Edit Project',
  },
  async asyncData({ app: { $accessor }, route }) {
    await $accessor.projects.findOne(route.params.id)

    return {
      project: cloneDeep($accessor.projects.project),
    }
  },
})
export default class AdminProjectEditPage extends Vue {
  project: null | Project = null

  breadcrumbs = [
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

  get isLoading() {
    return this.$accessor.projects.isLoading
  }

  get jobs() {
    return this.project?.jobs || []
  }

  get background() {
    if (
      !this.project ||
      !this.project.picture ||
      typeof this.project.picture !== 'string'
    )
      return null

    const url = this.project.picture

    if (url.startsWith('http')) return url

    return `${this.$config.staticBase}${url}`
  }

  get changes() {
    if (!this.project) return {}

    const dto: UpdateProjectDto = {
      name: this.project.name,
      description: this.project.description,
      picture: this.project.picture,
    }

    return shallowDiff(this.$accessor.projects.project!, dto)
  }

  async onDelete() {
    await this.$accessor.projects.delete(this.$route.params.id)

    if (this.$accessor.projects.isErrored) {
      return this.$snack('Failed to delete project')
    }

    this.$accessor.snackbar.show({
      text: 'Project Deleted',
    })

    this.$router.push('/admin/calendar/projects')
  }

  async onCreateJob(job: CreateJobDto) {
    await this.$accessor.volunteers.create({
      ...job,
      ...{ project: this.project!.id },
    })

    if (this.$accessor.volunteers.isErrored) {
      this.$snack(this.$accessor.volunteers.error!.message)
    } else {
      this.$snack('Job Added!')

      await this.refresh()
    }
  }

  async onSubmit() {
    const changed = this.project!

    const url = (await this.$accessor.files.filesToURL(changed.picture)) as
      | string
      | null

    if (this.$accessor.files.isErrored) {
      return this.$accessor.snackbar.show({
        text: this.$accessor.files.error!.message,
      })
    }

    const dto =
      typeof url === 'string'
        ? Object.assign({}, this.changes, { picture: url })
        : this.changes

    await this.$accessor.projects.update({
      id: this.project!.id,
      updateProjectDto: dto,
    })

    this.$accessor.snackbar.show({
      text: this.$accessor.projects.isErrored
        ? this.$accessor.projects.error!.message
        : 'Project Updated',
    })

    await this.refresh(false)
  }

  async refresh(load = true) {
    if (load) {
      await this.$accessor.projects.findOne(this.$route.params.id)
    }

    this.project = cloneDeep(this.$accessor.projects.project)
  }
}
</script>
