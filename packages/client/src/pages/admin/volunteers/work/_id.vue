<template>
  <div>
    <admin-header title="Edit Work" :breadcrumbs="breadcrumbs">
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

            <span>Are you sure you wish to delete this volunteer work?</span>
          </dialog-confirm>
        </v-list>
      </v-menu>
    </admin-header>

    <v-row v-if="work">
      <v-col cols="12">
        <v-card>
          <v-card-title>Information</v-card-title>

          <v-form-validated @submit:form="onSubmit">
            <v-card-text>
              <v-row>
                <client-only>
                  <v-col cols="12">
                    <auto-complete-user
                      v-model="user"
                      rules="required"
                      item-value="id"
                      label="User"
                      outlined
                    ></auto-complete-user>
                  </v-col>

                  <v-col cols="12">
                    <auto-complete-project
                      v-model="project"
                      rules="required"
                      item-value="id"
                      label="Project (Optional)"
                      outlined
                    ></auto-complete-project>
                  </v-col>
                </client-only>

                <v-col cols="12">
                  <v-text-field
                    v-model.number="work.hours"
                    type="tel"
                    outlined
                    hide-details="auto"
                    label="Volunteer Hours"
                    persistent-hint
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-select-validated
                    v-model="work.status"
                    :items="workStatuses"
                    rules="required"
                    outlined
                    hide-details="auto"
                    label="Work Status"
                    persistent-hint
                  ></v-select-validated>
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
    </v-row>
  </div>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash'
import { Component, Vue } from 'nuxt-property-decorator'
import { VolunteerWork } from '@server/volunteer-work/volunteer-work.entity'
import { UpdateWorkDto } from '@server/volunteer-work/dto/update-work.dto'
import { shallowDiff } from '~/utils/utilities'
import { workStatuses } from '~/utils/constants'

@Component({
  layout: 'admin',
  head: {
    title: 'Edit Work',
  },
  async asyncData({ app: { $accessor }, route }) {
    await $accessor.volunteers.findOneWork(route.params.id)

    return {
      work: cloneDeep($accessor.volunteers.work),
      user: $accessor.volunteers.work!.user.id,
      project: $accessor.volunteers.work!.project?.id || null,
    }
  },
})
export default class VolunteerWorkAdminPage extends Vue {
  work: null | VolunteerWork = null
  user: null | number = null
  project: null | number = null
  workStatuses = workStatuses

  breadcrumbs = [
    {
      text: 'Dashboard',
      href: '/admin/',
    },
    {
      text: 'Volunteer Work',
      href: '/admin/volunteers/work',
    },
    {
      text: 'Work',
    },
  ]

  get isLoading() {
    return this.$accessor.volunteers.isLoading
  }

  get changes() {
    if (!this.work) return {}

    const dto: UpdateWorkDto = Object.assign(
      { hours: this.work.hours },
      this.$accessor.volunteers.work!.user.id !== this.user && {
        user: this.user || undefined,
      },
      this.$accessor.volunteers.work!.project?.id !== this.project && {
        project: this.project || undefined,
      }
    )

    return shallowDiff(this.$accessor.volunteers.work!, dto)
  }

  /**
   * Reloads the work
   */
  async refresh(load = true) {
    if (load) {
      await this.$accessor.volunteers.findOneWork(this.$route.params.id)
    }

    this.work = cloneDeep(this.$accessor.volunteers.work)
    this.user = this.work!.user.id
    this.project = this.work!.project?.id || null
  }

  /**
   * Deletes the active work.
   */
  async onDelete() {
    await this.$accessor.volunteers.deleteWork(this.work!.id)

    if (this.$accessor.volunteers.isErrored) {
      return this.$snack('Failed to delete work :(')
    }

    this.$snack('Work Deleted!')

    this.$router.push('/admin/volunteers/work')
  }

  async onSubmit() {
    await this.$accessor.volunteers.updateWork({
      id: this.work!.id,
      updateWorkDto: this.changes,
    })

    if (this.$accessor.volunteers.isErrored) {
      return this.$snack(this.$accessor.volunteers.error!.message)
    }

    this.$snack('Work Updated!')
    await this.refresh()
  }
}
</script>
