<template>
  <div>
    <admin-header title="Edit Event" :breadcrumbs="breadcrumbs">
      <v-menu offset-y transition="slide-y-transition">
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            Actions <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list dense nav>
          <dialog-update-event
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
          </dialog-update-event>

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
    </admin-header>

    <dialog-delete-event
      ref="deleteModeSelector"
      @delete:confirm="onDeleteConfirm"
    />

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

                  <v-divider></v-divider>

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
                <v-img :src="background"></v-img>
              </v-avatar>
            </div>
          </div>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn :to="`/events/${event.id}`">Visit on App</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { format, isSameDay, isSameWeek, parseISO } from 'date-fns'
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import DialogDeleteEvent from '../../../../components/dialogs/DialogDeleteEvent.vue'

@Component({
  layout: 'admin',
  head: {
    title: 'Edit Event',
  },
  async fetch({ app: { $accessor }, route }) {
    await $accessor.events.findOne(route.params.id)
  },
})
export default class AdminEventEditPage extends Vue {
  @Ref('deleteModeSelector') readonly modeDialog!: DialogDeleteEvent

  breadcrumbs = [
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
  ]

  get event() {
    return this.$accessor.events.event!
  }

  get background() {
    const url = this.event.picture

    if (url.startsWith('http')) return url

    return `${this.$config.staticBase}${url}`
  }

  get dates() {
    return {
      start: parseISO(this.event.dtstart),
      end: parseISO(this.event.dtend),
    }
  }

  get dateText() {
    const { start, end } = this.dates

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
  }

  get timeText() {
    const { start, end } = this.dates

    if (isSameDay(start, end)) {
      return `${format(start, 'h:mm aaaa')} till ${format(end, 'h:mm aaaa')}`
    }
  }

  /**
   * Gateway method for determining if opening the delete
   * mode picker is necessary.
   */
  async onDeleteMenu() {
    if (this.event.recurrence) {
      return this.modeDialog.open()
    }

    await this.delete('single')
  }

  /**
   * Callback from the deletion dialog for recurring events.
   */
  async onDeleteConfirm(mode: 'single' | 'future' | 'all') {
    await this.delete(mode)
  }

  /**
   * Asks the backend to delete the event with the provided method
   * and redirects back to the calendar after.
   */
  async delete(mode: 'single' | 'future' | 'all') {
    await this.$accessor.events.delete({ id: this.$route.params.id, mode })

    if (this.$accessor.events.isErrored) {
      return this.$accessor.snackbar.show({
        text: this.$accessor.events.error?.message || 'Something went wrong :(',
      })
    }

    this.$router.push('/admin/calendar/events')
  }

  async onEventRefresh(id: string) {
    await this.$accessor.events.findOne(id)

    // If the event was removed, navigate back to the calendar.
    if (
      this.$accessor.events.isErrored &&
      this.$accessor.events.error!.status === 404
    ) {
      this.$router.push('/admin/calendar')
    }
  }
}
</script>
