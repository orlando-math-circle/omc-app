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

  <!-- Volunteer's Points/Placement card -->
  <div v-else-if="leaderboardUser">
    <v-row>
      <v-col>
        <v-card class="avatar--offset">
          <Avatar :url="leaderboardUser.user.avatarUrl" />

          <div
            class="d-flex flex-row align-center justify-center text-center"
            style="height: 125px"
          >
            <div class="text-h4 ma-2" style="width: 35%; font-weight: 600">
              {{ leaderboardUser.placement }} Place
            </div>

            <v-spacer />

            <div class="text-h4 ma-2" style="width: 35%; font-weight: 600">
              {{ leaderboardUser.user.volunteerHours }} Hours
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

          <v-card-subtitle>
            Top {{ MAX_LEADERBOARD_VOLUNTEERS }} OMC volunteers by cumulative
            hours
          </v-card-subtitle>

          <v-card-text>
            <v-list
              v-for="{ user, placement, style } in leaderboard"
              :key="user.id"
              rounded
            >
              <v-list-item :style="style">
                <v-list-item-avatar>
                  <v-img :src="user.avatarUrl" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="leaderboard">
                    {{ user.name }} <v-icon small>mdi-circle-medium</v-icon>
                    {{ user.volunteerHours }} Hours
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-actions>
                  <v-list-item-title class="leaderboard">
                    {{ placement }}
                  </v-list-item-title>
                </v-list-item-actions>
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

      <v-card-text v-if="isAdmin">
        Visit the admin panel to view volunteer activity.
      </v-card-text>

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
import { useStateReset, useSnackbar } from '@/composables'
import { Roles } from '@server/app.roles'

const MAX_LEADERBOARD_VOLUNTEERS = 10

export default defineComponent({
  setup() {
    const authStore = useAuth()
    const userStore = useUsers()
    const eventStore = useEvents()
    const snackbar = useSnackbar()

    const user = computed(() => authStore.user!)
    const isVolunteer = computed(() => authStore.isVolunteer)

    const events = computed(() => eventStore.events)

    const leaderboard = computed(() =>
      userStore.users
        .sort((a, b) => (b.volunteerHours || 0) - (a.volunteerHours || 0))
        .slice(0, MAX_LEADERBOARD_VOLUNTEERS)
        .map((volunteer, i) => ({
          user: volunteer,
          placement: `${i + 1}${placement(i + 1)}`,
          style: {
            background: `rgb(${colors[i][0]}, ${colors[i][1]}, ${colors[i][2]})`,
          },
        }))
    )

    const leaderboardUser = computed(() =>
      leaderboard.value.find((l) => l.user.id === user.value.id)
    )

    const { state, reset } = useStateReset({
      checkbox: false,
      checkbox1: false,
      checkbox2: false,
    })

    const colors: number[][] = []
    const start = [234, 128, 177]
    const end = [178, 188, 213]
    const difference = [start[0] - end[0], start[1] - end[1], start[2] - end[2]]

    for (let i = 0; i < MAX_LEADERBOARD_VOLUNTEERS; i++) {
      colors[i] = [
        start[0] - (i / (MAX_LEADERBOARD_VOLUNTEERS - 1)) * difference[0],
        start[1] - (i / (MAX_LEADERBOARD_VOLUNTEERS - 1)) * difference[1],
        start[2] - (i / (MAX_LEADERBOARD_VOLUNTEERS - 1)) * difference[2],
      ]
    }

    const placement = (n: number) =>
      // eslint-disable-next-line no-sparse-arrays
      [, 'st', 'nd', 'rd'][(n % 100 >> 3) ^ 1 && n % 10] || 'th'

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
      isVolunteer,
      isAdmin: computed(() => authStore.isAdmin),
      events,
      leaderboard,
      leaderboardUser,
      colors,
      onVolunteerRegistration,
      useStateReset,
      ...toRefs(state),
      reset,
      MAX_LEADERBOARD_VOLUNTEERS,
    }
  },
  async asyncData({ $pinia }) {
    const userStore = useUsers($pinia)
    const eventStore = useEvents($pinia)

    await Promise.all([
      // We have to find *all* volunteers because hours
      // are virtually calculated from attendance.
      userStore.findAll({ role: Roles.VOLUNTEER }),
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
