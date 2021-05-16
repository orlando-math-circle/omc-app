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
import { VolunteerWork } from '@server/volunteer-work/volunteer-work.entity'
import { UpdateWorkDto } from '@server/volunteer-work/dto/update-work.dto'
import { shallowDiff } from '@/utils/utilities'
import { workStatuses } from '@/utils/constants'
import { reactive } from 'vue-demi'
import { useWork } from '@/store/useWork'
import {
  computed,
  defineComponent,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import { useSnackbar } from '@/composables/useSnackbar'

export default defineComponent({
  layout: 'admin',
  setup() {
    const state = reactive({
      work: null as VolunteerWork | null,
      user: null as number | null,
      project: null as number | null,
    })

    const workStore = useWork()
    const route = useRoute()
    const router = useRouter()
    const snackbar = useSnackbar()

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
      if (!state.work) return {}

      const dto: UpdateWorkDto = Object.assign(
        { hours: state.work.hours },
        workStore!.user.id !== state.user && {
          user: state.user || undefined,
        },
        workStore!.project?.id !== state.project && {
          project: state.project || undefined,
        }
      )

      return shallowDiff(workStore.work!, dto)
    })

    const refresh = async (load = true) => {
      if (load) {
        await workStore.findOne(+route.value.params.id)
      }

      state.work = cloneDeep(workStore.work!)
      state.user = state.work!.user.id
      state.project = state.work!.project?.id || null
    }

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

      refresh()
    }

    return { workStatuses, breadcrumbs, isLoading, onDelete, onSubmit }
  },
  async asyncData({ pinia, route }) {
    const workStore = useWork(pinia)

    await workStore.findOne(+route.params.id)

    return {
      work: cloneDeep(workStore.work),
      user: workStore.work!.user.id,
      project: workStore.work!.project?.id || null,
    }
  },
  head: {
    title: 'Edit Work',
  },
})
</script>
