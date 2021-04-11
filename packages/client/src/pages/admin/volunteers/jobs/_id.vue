<template>
  <div>
    <admin-header title="Edit Job" :breadcrumbs="breadcrumbs">
      <v-menu offset-y transition="slide-y-transition">
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" color="primary" v-on="on">
            Actions <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list dense nav>
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

            <span>Are you sure you wish to delete this volunteer job?</span>
          </dialog-confirm>
        </v-list>
      </v-menu>
    </admin-header>

    <v-row v-if="job">
      <v-col cols="12">
        <v-card>
          <v-card-title>Information</v-card-title>

          <v-form-validated @submit:form="onSubmit">
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field-validated
                    v-model="job.name"
                    label="Name"
                    rules="required"
                    hide-details="auto"
                    outlined
                  ></v-text-field-validated>
                </v-col>

                <v-col cols="12">
                  <v-textarea-validated
                    v-model="job.description"
                    label="Description (Optional)"
                    rules="required"
                    hide-details="auto"
                    outlined
                  ></v-textarea-validated>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="job.hours"
                    type="tel"
                    outlined
                    hide-details="auto"
                    label="Volunteer Hours"
                    persistent-hint
                  ></v-text-field>
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
import { Component, Vue } from 'nuxt-property-decorator'
import { VolunteerJob } from '@server/volunteer-job/volunteer-job.entity'
import { UpdateJobDto } from '@server/volunteer-job/dto/update-job.dto'
import { shallowDiff } from '~/utils/utilities'

@Component({
  layout: 'admin',
  head: {
    title: 'Edit Job',
  },
  async asyncData({ app: { $accessor }, route }) {
    await $accessor.volunteers.findOne(route.params.id)

    return {
      job: cloneDeep($accessor.volunteers.job),
    }
  },
})
export default class VolunteerJobAdminPage extends Vue {
  job: null | VolunteerJob = null

  breadcrumbs = [
    {
      text: 'Dashboard',
      href: '/admin/',
    },
    {
      text: 'Jobs',
      href: '/admin/volunteers/jobs',
    },
    {
      text: 'Job',
    },
  ]

  get isLoading() {
    return this.$accessor.volunteers.isLoading
  }

  get changes() {
    if (!this.job) return {}

    const dto: UpdateJobDto = {
      name: this.job.name,
      description: this.job.description,
      hours: this.job.hours,
    }

    return shallowDiff(this.$accessor.volunteers.job!, dto)
  }

  /**
   * Reloads the job
   */
  async refresh(load = true) {
    if (load) {
      await this.$accessor.volunteers.findOne(this.$route.params.id)
    }

    this.job = cloneDeep(this.$accessor.volunteers.job)
  }

  /**
   * Deletes the active job.
   */
  async onDelete() {
    await this.$accessor.volunteers.delete(this.job!.id)

    if (this.$accessor.volunteers.isErrored) {
      return this.$snack('Failed to delete job :(')
    }

    this.$snack('Job Deleted')

    this.$router.push('/admin/volunteers/jobs')
  }

  async onSubmit() {
    await this.$accessor.volunteers.update({
      id: this.job!.id,
      updateJobDto: this.changes,
    })

    if (this.$accessor.volunteers.isErrored) {
      return this.$snack(this.$accessor.volunteers.error!.message)
    }

    this.$snack('Job Updated!')
    await this.refresh(false)
  }
}
</script>
