<template>
  <div v-if="isVolunteer">

    <!-- Volunteer's Points/Placement card -->
    <v-row class="mb-2">
      <v-col>
        <v-card class="avatar--offset" v-for="(volunteer, index) in volunteers" :key="volunteer.id">
          <div v-if="volunteer.id === user.id">
            <Avatar :url="user.avatarUrl" />

            <div
              class="d-flex flex-row align-center justify-center"
              style="height: 125px; text-align: center"
            >
              <div
                text
                left
                absolute
                class="text-h4 ma-2"
                style="width: 35%; font-weight: 600"
              >{{ placement(index) }} Place</div>
              <v-spacer />
              <div
                text
                right
                absolute
                class="text-h4 ma-2"
                style="width: 35%; font-weight: 600"
              >{{ user.volunteerHours }} hours</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Leaderboard Card -->
    <v-row>
      <v-col>
        <v-card class="mb-4">
          <v-card-title>Volunteer Leaderboard</v-card-title>
          <v-card-subtitle>Top {{ leaderboardMax }} OMC volunteers by cumulative hours</v-card-subtitle>

          <v-card-text>
            <v-list rounded v-for="(volunteer, index) in volunteersByHour" :key="volunteer.id">
              <v-list-item
                :style="{ background: 'rgb(' + colors[index][0] + ', ' + colors[index][1] + ', ' + colors[index][2] + ')' }"
              >
                <v-list-item-avatar>
                  <v-img :src="volunteer.avatarUrl" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="leaderboard">{{ volunteer.name }}</v-list-item-title>
                </v-list-item-content>

                <v-list-item-content>
                  <v-list-item-title class="leaderboard">{{ volunteer.volunteerHours }} hours</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Upcoming Events -->

    <v-row>
      <v-col>
        <h2 class="mb-3">Your upcoming events</h2>

        <div v-if="!events.length" class="subheader">No volunteer events scheduled</div>

        <div v-else>
          <div v-for="event in events" :key="event.id + '_spread'">
            <EventSpread :event="event" class="mb-5" />
          </div>
        </div>
      </v-col>
    </v-row>

  </div>

  <div v-else>
    <v-card class="mb-4">
      <v-card-title>Volunteers Only</v-card-title>
      <v-card-subtitle>You are not registered as a volunteer!</v-card-subtitle>
      <v-card-text v-if="isAdmin">Visit the admin panel to view volunteer activity.</v-card-text>
      <v-card-text v-else>
        If you would like to become a volunteer or there is an error with your
        account, please contact an administrator.
      </v-card-text>
    </v-card>
  </div>

</template>

<script lang="ts">
import { computed, defineComponent, useFetch } from '@nuxtjs/composition-api'
import { useAuth, useUsers, useEvents, useRegistrations } from '@/stores'
import { useDates } from '@/composables'
import { Roles } from '@server/app.roles'

export default defineComponent({
  setup() {
    const authStore = useAuth()
    const userStore = useUsers()
    const eventStore = useEvents()
    const registrationStore = useRegistrations()

    //const dateUtils = useDates()
    //const now = new Date()

    const user = computed(() => authStore.user!)
    const events = computed(() => eventStore.events)
    //const registrations = computed(() => registrationStore.registrations)
    const volunteers = computed(() => userStore.users)

    const volunteersByHour = computed(() => userStore.users.sort((a, b) => b.volunteerHours - a.volunteerHours).slice(0, leaderboardMax))

    // const getVolunteers = async () => {
    //   await userStore.findAll({ role: Roles.VOLUNTEER })
    // }

    // const getEvents = async () => {
    //   await eventStore.findAll({ start: now, end: dateUtils.addDays(now, 90) })
    // }

    // const getEvents = async () => {
    //   await eventStore.findAllRegistered({ volunteering: true })
    // }

    //useFetch(async () => await getVolunteers())
    //useFetch(async () => await getEvents())

    // also does not work
    // const volunteerEvents = computed(() =>
    //     eventStore.events.filter((u) =>
    //       registrationStore.registrations.find((a) => a.event.id === u.id)
    //     )
    // )

    // hard coded for the time being
    const leaderboardMax = 5;

    let colors = []

    let start = [234, 128, 177]
    let end = [178, 188, 213]
    let difference = [start[0] - end[0], start[1] - end[1], start[2] - end[2]]

    for (let i = 0; i < leaderboardMax; i++) {
      colors[i] = [
        start[0] - (i / (leaderboardMax - 1) * difference[0]),
        start[1] - (i / (leaderboardMax - 1) * difference[1]),
        start[2] - (i / (leaderboardMax - 1) * difference[2])
      ]
    }

    const placement = (n: number) => {
      return (n + 1) + ([, 'st', 'nd', 'rd'][(n + 1) / 10 % 10 ^ 1 && (n + 1) % 10] || 'th')
    }

    return {
      user,
      isVolunteer: computed(() => authStore.isVolunteer),
      isAdmin: computed(() => authStore.isAdmin),
      events,
      //volunteerEvents,
      volunteers,
      volunteersByHour,
      colors,
      leaderboardMax,
      placement,
    }
  },
  async asyncData({ $pinia }) {
    const userStore = useUsers($pinia)
    const eventStore = useEvents($pinia)
    const dateUtils = useDates()
    const now = new Date()

    await Promise.all([
      userStore.findAll({ role: Roles.VOLUNTEER }),
      eventStore.findAll({ start: now, end: dateUtils.addDays(now, 60) }),
      //eventStore.findAllRegistered({ volunteering: true })
    ])
  },
  head: {
    title: 'Volunteer Dashboard',
  },
})
</script>

<style lang="scss" scoped>
.leaderboard {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
}
</style>