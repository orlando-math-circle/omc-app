<template>
  <div v-if="!isVolunteer">
    <h1 class="text-center mb-10">Register to Volunteer!</h1>
    <p>Please read the following forms carefully before digitally signing.</p>

    <VFormValidated
      ref="volunteerRegistrationForm"
      @form:submit="onVolunteerRegistration(user)"
    >
      <v-row class="mb-10">
        <h3 class="mb-5">Photo Release and Liability Waiver</h3>

        <object
          data="/OMC_Photo_release_and_Liability_WaiverOnline_Policy.pdf"
          type="application/pdf"
          width="100%"
          height="480"
        />

        <v-list width="100%">
          <v-list-item>
            <VCheckboxValidated v-model="checkbox" rules="required" required />

            <v-list-item-content>
              <label class="pl-5"
                >I agree to the terms and conditions inside the Photo Release
                and Liability Waiver</label
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-row>

      <v-row class="mb-10">
        <h3 class="mb-5">Code of Conduct</h3>
        <object
          data="/Volunteers_-_Code_of_Conduct.pdf"
          type="application/pdf"
          width="100%"
          height="480"
        />
        <v-list width="100%">
          <v-list-item>
            <VCheckboxValidated v-model="checkbox1" rules="required" required />

            <v-list-item-content>
              <label class="pl-5"
                >I agree to the terms and conditions inside the Code of
                Conduct</label
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-row>

      <v-row class="mb-10">
        <h3 class="mb-5">Volunteer SOP</h3>
        <object
          data="/OMC_IC_Volunteer_SOP.pdf"
          type="application/pdf"
          width="100%"
          height="480"
        />
        <v-list width="100%">
          <v-list-item>
            <VCheckboxValidated v-model="checkbox2" rules="required" required />

            <v-list-item-content>
              <label class="pl-5"
                >I agree to the terms and conditions inside the Volunteer
                SOP</label
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-row>
      <v-btn type="submit" color="primary"> Register as Volunteer </v-btn>
    </VFormValidated>
  </div>

  <div v-else-if="isVolunteer">
    <!-- Volunteer's Points/Placement card -->
    <v-row class="mb-2">
      <v-col>
        <v-card
          v-for="(volunteer, index) in volunteers"
          :key="volunteer.id"
          class="avatar--offset"
        >
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
              >
                {{ placement(index) }} Place
              </div>
              <v-spacer />
              <div
                text
                right
                absolute
                class="text-h4 ma-2"
                style="width: 35%; font-weight: 600"
              >
                {{ user.volunteerHours }} hours
              </div>
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
          <v-card-subtitle
            >Top {{ leaderboardMax }} OMC volunteers by cumulative
            hours</v-card-subtitle
          >
          <v-card-text>
            <v-list
              v-for="(volunteer, index) in volunteersByHour"
              :key="volunteer.id"
              rounded
            >
              <v-list-item
                :style="{
                  background:
                    'rgb(' +
                    colors[index][0] +
                    ', ' +
                    colors[index][1] +
                    ', ' +
                    colors[index][2] +
                    ')',
                }"
              >
                <v-list-item-avatar>
                  <v-img :src="volunteer.avatarUrl" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="leaderboard">{{
                    volunteer.name
                  }}</v-list-item-title>
                </v-list-item-content>

                <v-list-item-content>
                  <v-list-item-title class="leaderboard"
                    >{{ volunteer.volunteerHours }} hours</v-list-item-title
                  >
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
        <h2 class="mb-3">Your events</h2>

        <div v-if="!events.length" class="subheader">
          No volunteer events scheduled
        </div>

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
      <v-card-text v-if="isAdmin"
        >Visit the admin panel to view volunteer activity.</v-card-text
      >
      <v-card-text v-else>
        If you would like to become a volunteer or there is an error with your
        account, please contact an administrator.
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from '@nuxtjs/composition-api'
import { useAuth, useUsers, useEvents, UserEntity } from '@/stores'
import { useDates, useStateReset, useSnackbar } from '@/composables'
import { Roles } from '@server/app.roles'

export default defineComponent({
  setup() {
    const authStore = useAuth()
    const userStore = useUsers()
    const eventStore = useEvents()
    const snackbar = useSnackbar()

    const user = computed(() => authStore.user!)
    const events = computed(() => eventStore.events)
    const volunteers = computed(() => userStore.users)

    const volunteersByHour = computed(() =>
      userStore.users
        .sort((a, b) => (b.volunteerHours || 0) - (a.volunteerHours || 0))
        .slice(0, leaderboardMax)
    )

    const { state, reset } = useStateReset({
      checkbox: false,
      checkbox1: false,
      checkbox2: false,
    })

    const leaderboardMax = 5

    const colors = []
    const start = [234, 128, 177]
    const end = [178, 188, 213]
    const difference = [start[0] - end[0], start[1] - end[1], start[2] - end[2]]

    for (let i = 0; i < leaderboardMax; i++) {
      colors[i] = [
        start[0] - (i / (leaderboardMax - 1)) * difference[0],
        start[1] - (i / (leaderboardMax - 1)) * difference[1],
        start[2] - (i / (leaderboardMax - 1)) * difference[2],
      ]
    }

    const placement = (n: number) => {
      return (
        n +
        1 +
        ([, 'st', 'nd', 'rd'][((n + 1) / 10) % 10 ^ 1 && (n + 1) % 10] || 'th')
      )
    }

    const onVolunteerRegistration = async (user: UserEntity) => {
      if (state.checkbox && state.checkbox1 && state.checkbox2) {
        if (!user.roles.includes(Roles.VOLUNTEER)) {
          await userStore.update(user.id, { volunteer: true }, true)
          if (userStore.error) {
            snackbar.error(userStore.error.message)
          }
          snackbar.success('You have registered as a volunteer!')
          authStore.getMyUser()
        } else snackbar.error('You are already registered as a volunteer!')
      } else
        snackbar.error(
          'Please read each form carefully and agree to the terms.'
        )
    }

    return {
      user,
      isVolunteer: computed(() => authStore.isVolunteer),
      isAdmin: computed(() => authStore.isAdmin),
      events,
      volunteers,
      volunteersByHour,
      colors,
      leaderboardMax,
      placement,
      onVolunteerRegistration,
      useStateReset,
      ...toRefs(state),
      reset,
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
      eventStore.findAllRegistered({ volunteering: true }),
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
