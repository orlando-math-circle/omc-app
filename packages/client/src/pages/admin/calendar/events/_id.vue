<template>
  <div>
    <AdminHeader title="Edit Event" :breadcrumbs="breadcrumbs">
      <v-menu offset-y transition="slide-y-transition">
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            Actions <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list dense nav>
          <DialogUpdateEvent
            :event="event"
            @event:refresh="onEventRefresh"
            @event:update="onEventRefresh"
          >
            <template #activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-icon>
                  <v-icon>mdi-calendar-edit</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </DialogUpdateEvent>

          <v-list-item @click="onDeleteMenu">
            <v-list-item-icon>
              <v-icon>mdi-trash-can</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </AdminHeader>

    <DialogDeleteEvent
      ref="deleteModeSelector"
      @delete:confirm="onDeleteConfirm"
    />

    <template v-if="$fetchState.pending">
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>Loading...</v-card-title>

            <v-card-text>Fetching event</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <v-row>
      <v-col>
        <v-card>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title>{{ event.name }}</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-clock</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>{{ dateText }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        timeText
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider />

                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-text</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title> Description</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ event.description }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </div>

            <div class="ma-3">
              <v-avatar size="125" rounded class="elevation-2">
                <v-img :src="background" />
              </v-avatar>
            </div>
          </div>

          <v-card-actions>
            <v-spacer />

            <v-btn :to="`/events/${event.id}`" text>Visit on App</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useRouter,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import { format, isSameDay, isSameWeek, parseISO } from 'date-fns'
import DialogDeleteEvent from '@/components/dialog/DeleteEvent.vue'
import { useSnackbar } from '@/composables'
import { useEvents } from '@/stores'

export default defineComponent({
  layout: 'admin',
  setup() {
    const deleteModeSelector = ref<InstanceType<typeof DialogDeleteEvent>>()

    const { $config } = useContext()
    const eventStore = useEvents()
    const snackbar = useSnackbar()
    const route = useRoute()
    const router = useRouter()

    const event = computed(() => eventStore.event!)
    const background = computed(() => {
      const url = event.value.picture

      if (url.startsWith('http')) return url

      return `${$config.staticBase}${url}`
    })
    const dates = computed(() => ({
      start: parseISO(event.value.dtstart),
      end: parseISO(event.value.dtend),
    }))

    const dateText = computed(() => {
      const { start, end } = dates.value

      if (isSameDay(start, end)) {
        return format(start, 'EEE, LLL d, yyyy')
      } else if (isSameWeek(start, end)) {
        return `${format(start, 'EEE')} - ${format(end, 'EEE, LLL d, yyyy')}`
      } else {
        return `${format(start, 'EEE, LLL d, yyyy')} - ${format(
          end,
          'EEE, LLL d, yyyy'
        )}`
      }
    })

    const timeText = computed(() => {
      const { start, end } = dates.value

      if (isSameDay(start, end)) {
        return `${format(start, 'h:mm aaaa')} till ${format(end, 'h:mm aaaa')}`
      }
    })

    /**
     * Gateway method for determining if opening the delete
     * mode picker is necessary.
     */
    const onDeleteMenu = async () => {
      if (event.value.recurrence) {
        return deleteModeSelector.value!.open()
      }

      await del('single')
    }

    /**
     * Callback from the deletion dialog for recurring events.
     */
    const onDeleteConfirm = async (mode: 'single' | 'future' | 'all') => {
      await del(mode)
    }

    /**
     * Asks the backend to delete the event with the provided method
     * and redirects back to the calendar after.
     */
    const del = async (mode: 'single' | 'future' | 'all') => {
      await eventStore.delete(+route.value.params.id, mode)

      if (eventStore.error) {
        snackbar.error(eventStore.error.message)
      }

      router.push('/admin/calendar/events')
    }

    const onEventRefresh = async (id: string) => {
      await eventStore.findOne(+id)

      // If the event was removed, navigate back to the calendar.
      if (eventStore.error?.status === 404) {
        router.push('/admin/calendar')
      }
    }

    useFetch(async () => await eventStore.findOne(+route.value.params.id))

    return {
      deleteModeSelector,
      event,
      background,
      dates,
      dateText,
      timeText,
      onDeleteMenu,
      onDeleteConfirm,
      delete: del,
      onEventRefresh,
      breadcrumbs: [
        {
          text: 'Dashboard',
          href: '/admin/',
        },
        {
          text: 'Events',
          href: '/admin/calendar/events',
        },
        {
          text: 'Event',
        },
      ],
    }
  },
  head: {
    title: 'Edit Event',
  },
})
</script>
