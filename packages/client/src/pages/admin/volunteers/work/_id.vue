<template>
  <div>
    <AdminHeader title="Edit Work" :breadcrumbs="breadcrumbs">
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

            <span>Are you sure you wish to delete this volunteer work?</span>
          </DialogConfirm>
        </v-list>
      </v-menu>
    </AdminHeader>

    <v-row v-if="state && state.work">
      <v-col cols="12">
        <v-card>
          <v-card-title>Information</v-card-title>

          <VFormValidated @form:submit="onSubmit">
            <v-card-text>
              <v-row>
                <client-only>
                  <v-col cols="12">
                    <AutocompleteUser v-model="state.userId" />
                  </v-col>

                  <v-col cols="12">
                    <AutocompleteProject
                      v-model="state.projectId"
                      label="Project (Optional)"
                    />
                  </v-col>
                </client-only>

                <v-col cols="12">
                  <v-text-field
                    v-model.number="state.work.hours"
                    type="tel"
                    outlined
                    hide-details="auto"
                    label="Volunteer Hours"
                    persistent-hint
                  />
                </v-col>

                <v-col cols="12">
                  <VSelectValidated
                    v-model="state.work.status"
                    :items="workStatuses"
                    rules="required"
                    outlined
                    hide-details="auto"
                    label="Work Status"
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
    </v-row>
  </div>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash'
import { UpdateWorkDto } from '@server/volunteer-work/dto/update-work.dto'
import { shallowDiff } from '@/utils/utilities'
import { workStatuses } from '@/utils/constants'
import { useWork, WorkEntity } from '@/stores'
import {
  computed,
  defineComponent,
  useRouter,
  useRoute,
  useFetch,
  reactive,
} from '@nuxtjs/composition-api'
import { useSnackbar } from '@/composables'

export default defineComponent({
  layout: 'admin',
  setup() {
    const router = useRouter()
    const snackbar = useSnackbar()
    const workStore = useWork()
    const route = useRoute()

    const state = reactive({
      work: null as WorkEntity | null,
      userId: null as number | null,
      projectId: null as number | null,
    })

    const fetch = async () => {
      await workStore.findOne(+route.value.params.id)

      if (workStore.error) {
        return snackbar.error(workStore.error.message)
      }

      state.work = cloneDeep(workStore.work)
      state.userId = workStore.work!.user.id
      state.projectId = workStore.work!.project?.id || null
    }

    useFetch(fetch)

    const breadcrumbs = [
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

    const isLoading = computed(() => workStore.isLoading)

    const changes = computed(() => {
      if (!state?.work) return {}

      const dto: UpdateWorkDto = Object.assign(
        { hours: state.work.hours },
        workStore.work!.user.id !== state.userId && {
          user: state.userId || undefined,
        },
        workStore.work!.project?.id !== state.projectId && {
          project: state.projectId || undefined,
        }
      )

      return shallowDiff(workStore.work!, dto)
    })

    const onDelete = async () => {
      await workStore.delete(state.work!.id)

      if (workStore.error) {
        return snackbar.error('Failed to delete work :(')
      }

      snackbar.success('Work Deleted!')

      router.push('/admin/volunteers/work')
    }

    const onSubmit = async () => {
      await workStore.update(state.work!.id, changes.value)

      if (workStore.error) {
        return snackbar.error('Failed to update work :(')
      }

      snackbar.success('Work Updated')

      fetch()
    }

    return {
      state,
      workStatuses,
      breadcrumbs,
      isLoading,
      onDelete,
      onSubmit,
      refresh: fetch,
      changes,
    }
  },
  head: {
    title: 'Edit Work',
  },
})
</script>
