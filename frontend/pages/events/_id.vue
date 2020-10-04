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
            <v-img src="~/assets/images/programmer.jpg"></v-img>
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

      <v-stepper v-model="step" vertical class="mt-5">
        <!-- Step: User Selection -->
        <v-stepper-step editable :complete="selected.length > 0" step="1">
          Select students to register
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-card flat>
            <v-card-title>User Selection</v-card-title>
            <v-card-subtitle>
              Select which users you wish to register. You may add more users on
              the account page.
            </v-card-subtitle>

            <v-card-text>
              <v-list>
                <v-list-item-group v-model="selected" multiple>
                  <v-list-item
                    v-for="status in statuses"
                    :key="status.user.id"
                    :disabled="!status.eligible"
                  >
                    <template v-slot:default="{ active }">
                      <v-list-item-avatar>
                        <!-- <v-icon>mdi-account-circle-outline</v-icon> -->
                        <v-img
                          :src="
                            status.user.avatar ||
                            '/images/default_avatars/paper.png'
                          "
                        ></v-img>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title>
                          {{ status.user.first }} {{ status.user.last }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ getStatusMessage(status) }}
                        </v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-btn
                          v-if="status.registered"
                          icon
                          @click="cancelRegistration(status)"
                        >
                          <v-icon>mdi-close-box</v-icon>
                        </v-btn>
                        <v-checkbox
                          v-else-if="status.eligible"
                          :input-value="active"
                        />
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card-text>

            <v-card-actions>
              <v-btn
                medium
                color="primary"
                :disabled="!selected.length"
                @click="step++"
              >
                Continue
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <!-- Step: Payment -->
        <v-stepper-step
          :completed="statusesSelectedUnpaid.length === 0"
          step="2"
          >Payment</v-stepper-step
        >
        <v-stepper-content step="2">
          <v-card-title>Payment Due: ${{ sumFee }}</v-card-title>

          <v-card-text>
            <paypal
              :event="event.id"
              :users="userIds"
              @payment:complete="onPaymentComplete"
            />
          </v-card-text>

          <v-btn
            medium
            color="primary"
            :disabled="statusesSelectedUnpaid.length > 0"
            @click="step++"
            >Continue
          </v-btn>
          <v-btn medium text @click="step--">Go Back</v-btn>
        </v-stepper-content>

        <!-- Step: Event Registration -->
        <v-stepper-step step="3">Complete Registration</v-stepper-step>
        <v-stepper-content step="3">
          <v-btn :loading="loading" @click="onSubmit">
            Complete Registration
          </v-btn>
        </v-stepper-content>

        <!-- Step: Confirmation -->
        <v-stepper-step step="4">Confirmation</v-stepper-step>
        <v-stepper-content step="4">
          Registrations Completed
        </v-stepper-content>
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { format } from 'date-fns'
import { Invoice } from '~/../backend/src/invoice/invoice.entity'
import { User } from '~/../backend/src/user/user.entity'
import { EventRegistrationStatus } from '~/../backend/src/event-registration/dtos/event-registration-status.dto'
import { getOrdinal } from '~/utils/utilities'

export interface UserEligibility {
  user: User
  eligible: boolean
  invoice?: Invoice
  grade?: number
  subtitle: string
}

@Component({
  head() {
    return {
      title: 'Registration',
    }
  },
})
export default class EventIdPage extends Vue {
  account: null | any = null // TODO: Fix issue with collection type on Users
  selected: number[] = []
  step = 1
  breadcrumbs = [
    {
      text: 'Calendar',
      href: '/events',
    },
    {
      text: 'Event',
      href: `/event/${this.$route.params.id}`,
    },
  ]

  loading = false

  get event() {
    return this.$accessor.events.event
  }

  get statuses() {
    return this.$accessor.registrations.registrationStatuses
  }

  get start(): string {
    if (!this.event) return ''

    return format(new Date(this.event.dtstart), 'eee, MMM do yyyy')
  }

  get fee(): string | undefined {
    if (!this.event) return undefined

    if (this.event.course?.fee) {
      return this.event.course.fee
    } else if (this.event.fee) {
      return this.event.fee
    }

    return undefined
  }

  get sumFee(): number {
    const fee = parseFloat(this.fee || '0')

    return fee * this.statusesSelectedUnpaid.length
  }

  get userIds() {
    return this.statusesSelected.map((status) => status.user.id)
  }

  get statusesSelected() {
    return this.selected.map((i) => this.statuses[i])
  }

  get statusesSelectedUnpaid() {
    return this.statusesSelected.filter((status) => !status.paid)
  }

  async fetch() {
    await Promise.all([
      this.$accessor.events.findOne(this.$route.params.id),
      this.$accessor.registrations.getStatuses(this.$route.params.id),
    ])
  }

  async onSubmit() {
    try {
      this.loading = true
      await this.$accessor.registrations.create({
        eventId: +this.$route.params.id,
        users: this.statusesSelected.map((status) => status.user.id),
      })
      await this.$accessor.registrations.getStatuses(this.$route.params.id)
      this.step = 4
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
  }

  onPaymentComplete() {
    this.$accessor.registrations.getStatuses(this.$route.params.id)
  }

  getStatusMessage(status: EventRegistrationStatus) {
    let retval = ''

    if (status.user.age >= 18) {
      retval += 'Adult -'
    } else {
      retval += `${status.user.grade}${getOrdinal(status.user.grade)} Grade -`
    }

    if (status.registered) {
      retval += ' Registered'
    } else if (status.eligible) {
      retval += ' Eligible'
    } else {
      retval += ' Ineligible'
    }

    return retval
  }

  cancelRegistration(status: EventRegistrationStatus) {
    console.log(status)
  }
}
</script>

<style lang="scss" scoped>
.event-header {
  font-family: 'Spartan', sans-serif;
  font-weight: bold;
  font-size: 1.2em;
}
</style>
