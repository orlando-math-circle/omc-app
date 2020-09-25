<template>
  <v-row>
    <v-col v-if="!!event">
      <v-row no-gutters class="mb-5">
        <v-col cols="auto" align-self="center" align="center">
          <v-btn icon class="pr-2" @click="$router.back()">
            <v-icon large>mdi-chevron-left</v-icon>
          </v-btn>
        </v-col>

        <v-col>
          <v-row no-gutters>
            <v-col>
              <h2 class="d-inline-flex">{{ event.name }}</h2>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col>
              <v-breadcrumbs :items="breadcrumbs" large class="pa-0">
                <template #divider>
                  <v-icon size="20">mdi-chevron-right</v-icon>
                </template>
              </v-breadcrumbs>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-card>
        <v-card-title class="pb-0">Event Details</v-card-title>
        <v-list-item>
          <v-list-item-content>
            <v-row no-gutters class="mb-2">
              <v-col cols="auto">
                <v-icon>mdi-clock-outline</v-icon>
              </v-col>

              <v-col class="pl-5">
                {{ start }}
              </v-col>
            </v-row>

            <v-row no-gutters class="mb-2">
              <v-col cols="auto">
                <v-icon>mdi-account-circle-outline</v-icon>
              </v-col>

              <v-col class="pl-5">
                {{ event.author.first }} {{ event.author.last }}
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="auto">
                <v-icon>
                  {{ event.isOnline ? 'mdi-web' : 'mdi-map-marker-outline' }}
                </v-icon>
              </v-col>

              <v-col class="pl-5">
                {{ event.isOnline ? 'Online' : event.location }}
              </v-col>
            </v-row>
          </v-list-item-content>

          <v-list-item-avatar rounded size="100">
            <v-img :src="require('~/assets/images/programmer.jpg')"></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-card-text>
          <v-row no-gutters>
            <v-col>
              {{ event.description }}
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- User Selection -->
      <v-card class="mt-5">
        <v-card-title>Registration</v-card-title>

        <v-card-subtitle>
          Select which users you wish to register. You may add more users on the
          account page.
        </v-card-subtitle>

        <v-card-text>
          <v-list>
            <v-list-item-group v-model="selected" multiple>
              <v-list-item v-for="user in account.users" :key="user.id">
                <template v-slot:default="{ active }">
                  <v-list-item-avatar>
                    <!-- <v-icon>mdi-account-circle-outline</v-icon> -->
                    <v-img
                      :src="user.avatar || '/images/default_avatars/paper.png'"
                    ></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>
                      {{ user.first }} {{ user.last }}
                    </v-list-item-title>
                    <v-list-item-subtitle v-if="user.age >= 18">
                      Adult — {{ active ? 'Selected' : 'Eligible' }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle v-else>
                      {{
                        user.grade === 13 ? 'Graduated' : `Grade ${user.grade}`
                      }}
                      —
                      {{ active ? 'Selected' : 'Eligible' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-checkbox :input-value="active" />
                  </v-list-item-action>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </v-card>

      <!-- PayPal Payment Module -->
      <v-expand-transition>
        <v-card v-if="fee && selected.length" class="mt-5">
          <v-card-title>Payment Due: ${{ sumFee }}</v-card-title>

          <v-card-text>
            <paypal />
          </v-card-text>
        </v-card>
      </v-expand-transition>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'

export default {
  async fetch() {
    const [event, account] = await Promise.all([
      this.$axios.$get(`/event/${this.$route.params.id}`),
      this.$axios.$get('/account/me'),
    ])

    this.event = event
    this.account = account
  },
  data() {
    return {
      event: null,
      account: null,
      selected: [],
      breadcrumbs: [
        {
          text: 'Calendar',
          href: '/events',
        },
        {
          text: 'Event',
          href: `/event/${this.$route.params.id}`,
        },
      ],
    }
  },
  computed: {
    start() {
      if (!this.event) return ''

      return moment(this.event.dtstart).format('ddd, MMM Mo, YYYY')
    },
    fee() {
      if (!this.event) return false

      if (this.event.course) {
        return this.event.course.fee
      } else if (this.event.fee) {
        return this.event.fee
      }

      return false
    },
    sumFee() {
      const fee = parseFloat(this.fee)

      return fee * this.selected.length
    },
  },
  head: {
    title: 'Event',
  },
}
</script>

<style lang="scss" scoped>
.event-header {
  font-family: 'Spartan', sans-serif;
  font-weight: bold;
  font-size: 1.2em;
}
</style>
