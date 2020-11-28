<template>
  <v-row>
    <!-- Event Picture -->
    <v-col cols="12">
      <v-card>
        <v-img max-height="200" :src="picture">
          <v-toolbar flat class="picture--toolbar">
            <v-btn icon @click="$router.back()">
              <v-sheet class="pa-2 rounded">
                <v-icon>mdi-arrow-left</v-icon>
              </v-sheet>
            </v-btn>

            <v-spacer />

            <dialog-lightbox :image="picture">
              <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-sheet class="pa-2 rounded">
                    <v-icon>mdi-open-in-new</v-icon>
                  </v-sheet>
                </v-btn>
              </template>
            </dialog-lightbox>
          </v-toolbar>
        </v-img>
      </v-card>
    </v-col>

    <!-- Event Metadata -->
    <v-col cols="12">
      <v-card>
        <v-card-title>{{ event.name }}</v-card-title>

        <v-card-text>
          <v-list>
            <v-list-item class="pl-0">
              <v-list-item-avatar class="icon--bg rounded">
                <v-icon color="primary">mdi-calendar-clock</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ date }}</v-list-item-title>
                <v-list-item-subtitle>{{ times }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item class="pl-0">
              <v-list-item-avatar class="icon--bg rounded">
                <v-icon color="primary">mdi-compass</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ event.locationTitle }}</v-list-item-title>
                <v-list-item-subtitle v-if="event.location">
                  {{ event.location }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-if="fee" class="pl-0">
              <v-list-item-avatar class="icon--bg rounded">
                <v-icon color="primary">mdi-currency-usd</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>Event Fees</v-list-item-title>
                <v-list-item-subtitle>
                  <span v-if="isLate">Late Fee •</span>
                  ${{ fee }} Per Person
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-if="perms" class="pl-0">
              <v-list-item-avatar class="icon--bg rounded">
                <v-icon color="primary">mdi-school-outline</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ perms.title }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  perms.subtitle
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-title>Description</v-card-title>

        <v-card-text>
          <span>{{ description }}</span>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Existing Registrations -->
    <v-expand-transition>
      <v-col v-if="registeredUsers.length" cols="12">
        <v-card>
          <v-card-title>Registered Users</v-card-title>

          <v-card-text>
            <v-list rounded>
              <v-list-item
                v-for="status in registeredUsers"
                :key="status.user.id"
              >
                <v-list-item-avatar>
                  <v-img :src="avatar(status.user)" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ status.user.name }}</v-list-item-title>

                  <v-list-item-subtitle v-if="!status.eligible">
                    Ineligible
                  </v-list-item-subtitle>

                  <v-list-item-subtitle v-else-if="status.user.grade">
                    Eligible • {{ grade(status.user) }}
                  </v-list-item-subtitle>

                  <v-list-item-subtitle v-else>Eligible</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action v-if="!isClosed">
                  <v-btn text @click="cancelDialog.open(status)">
                    Cancel
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-expand-transition>

    <!-- Registration Process -->
    <v-col v-if="unregisteredUsers.length" cols="12">
      <v-card v-if="isClosed">
        <v-card-title>Registrations Closed</v-card-title>

        <v-card-text>
          This event is no longer accepting new registrations at this time.
        </v-card-text>
      </v-card>

      <v-stepper v-else v-model="step">
        <v-stepper-items>
          <v-stepper-content class="pa-0" step="1">
            <v-card>
              <v-card-title>Registration</v-card-title>

              <v-card-text>
                <v-list rounded>
                  <v-list-item-group
                    v-model="selections"
                    multiple
                    active-class="primary--text"
                  >
                    <v-list-item
                      v-for="status in unregisteredUsers"
                      :key="status.user.id"
                      :disabled="!status.eligible"
                    >
                      <template #default="{ active }">
                        <v-list-item-avatar>
                          <v-img :src="avatar(status.user)" />
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>{{
                            status.user.name
                          }}</v-list-item-title>

                          <v-list-item-subtitle v-if="!status.eligible">
                            Not Eligible
                          </v-list-item-subtitle>

                          <v-list-item-subtitle v-else-if="status.user.grade">
                            <span>Eligible</span>
                            <span>• {{ grade(status.user) }}</span>
                            <span v-if="status.paid">• Paid</span>
                          </v-list-item-subtitle>

                          <v-list-item-subtitle v-else
                            >Eligible</v-list-item-subtitle
                          >
                        </v-list-item-content>

                        <v-list-item-action v-if="status.eligible">
                          <v-checkbox :input-value="active"></v-checkbox>
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  v-if="!$accessor.auth.isValidated"
                  disabled
                  rounded
                  block
                >
                  Email Verification Required
                </v-btn>

                <v-btn
                  v-else-if="!selections.length"
                  rounded
                  block
                  disabled
                  @click="register"
                >
                  Select Users
                </v-btn>

                <v-btn
                  v-else-if="checkoutCost === 0"
                  rounded
                  block
                  color="primary"
                  @click="register"
                >
                  Complete Registration
                </v-btn>

                <v-btn v-else rounded block color="primary" @click="step++">
                  Continue to Payment
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-content class="pa-0" step="2">
            <v-card>
              <v-card-title>Payment Due: ${{ checkoutCost }}</v-card-title>

              <v-card-text>
                <paypal
                  :event="event.id"
                  :users="usersRequiringPayment.map((u) => u.id)"
                  @payment:complete="onPaymentComplete"
                />
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn text @click="step--">Go Back</v-btn>
                <v-btn color="primary" @click="step++">Continue</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-content class="pa-0" step="3">
            <v-card>
              <v-card-title> Confirmation </v-card-title>

              <v-card-text>Confirmation</v-card-text>
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-col>

    <!-- Registration -->
    <v-col cols="12"> </v-col>

    <dialog-confirm ref="cancelDialog" @confirm="onCancelConfirm">
      You may re-register at any time for no charge.
    </dialog-confirm>
  </v-row>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import { contiguousGradeRanges, gradeGroups } from '../../utils/events'
import { User } from '../../../backend/src/user/user.entity'
import { Sex } from '../../../backend/src/user/enums/sex.enum'
import { EventRegistrationStatus } from '../../../backend/src/event-registration/dtos/event-registration-status.dto'
import { EventRegistration } from '../../../backend/src/event-registration/event-registration.entity'
import DialogConfirm from '../../components/dialogs/DialogConfirm.vue'
import { grades } from '~/utils/events'
import { formatDate } from '~/utils/utilities'

enum RegisterStep {
  SELECTION = 1,
  PAYMENT = 2,
  COMPLETION = 3,
}

@Component({
  head: {
    title: 'Event Details',
  },
  async fetch({ app: { $accessor }, route }) {
    await Promise.all([
      $accessor.events.findOne(route.params.id),
      $accessor.registrations.getStatuses(route.params.id),
    ])
  },
})
export default class EventPage extends Vue {
  @Ref('cancelDialog') readonly cancelDialog!: DialogConfirm

  selections: number[] = []
  step: RegisterStep = RegisterStep.SELECTION

  get event() {
    return this.$accessor.events.event!
  }

  get statuses() {
    return this.$accessor.registrations.registrationStatuses
  }

  get picture() {
    const url = this.event.picture ?? this.event?.project?.picture

    if (!url) return this.$accessor.events.defaultPicture

    if (url.startsWith('http')) return url

    return `${this.$config.staticBase}${url}`
  }

  get date() {
    return this.format(this.event.dtstart, 'EEE, LLL d, yyyy')
  }

  get times() {
    return `${this.format(this.event.dtstart, 'h:mm a')} - ${this.format(
      this.event.dtend,
      'h:mm a'
    )}`
  }

  get description() {
    return this.event.description && this.event.description !== ''
      ? this.event.description
      : 'No description provided.'
  }

  get selectedStatuses() {
    return this.selections.map((s) => this.statuses[s])
  }

  get fee(): string | undefined {
    if (this.event?.course?.fee) {
      if (this.event.course.isLate) {
        return this.event.course.fee.lateAmount
      } else {
        return this.event.course.fee.amount
      }
    } else if (this.event?.fee) {
      if (this.event.isLate) {
        return this.event.fee.lateAmount
      } else {
        return this.event.fee.amount
      }
    }
  }

  get isLate(): boolean {
    return this.event.course?.isLate || this.event.isLate
  }

  get checkoutCost() {
    if (typeof this.fee !== 'string') return 0

    const fee = parseFloat(this.fee) || 0
    return fee * this.usersRequiringPayment.length
  }

  get perms() {
    if (!this.event.permissions) return

    const { sexes, grades } = this.event.permissions

    let title: string | null = null
    let subtitle: string | null = null

    if (grades?.length) {
      const ranges = gradeGroups(contiguousGradeRanges(grades))

      title = ranges.join(', ')
    } else {
      title = 'All Grade Levels'
    }

    // If both male and female are selected, don't show anything.
    if (sexes?.length === 1) {
      const str = sexes[0] === Sex.MALE ? 'Boys Only' : 'Girls Only'

      subtitle = str
    } else {
      subtitle = 'Boys and Girls'
    }

    return { title, subtitle }
  }

  get registeredUsers() {
    return this.statuses.filter((s) => s.registration !== false)
  }

  get unregisteredUsers() {
    return this.statuses.filter((s) => !this.registeredUsers.includes(s))
  }

  get usersRequiringPayment() {
    const retval: User[] = []

    for (const status of this.selectedStatuses) {
      if (status.paid || status.user.feeWaived) continue

      retval.push(status.user)
    }

    return retval
  }

  /**
   * Determines if the event is open to new registrations.
   * TODO: Implement override functionality.
   */
  get isClosed() {
    return !!(this.event?.isClosed || this.event?.course?.isClosed)
  }

  avatar(user: User) {
    if (!user.avatar)
      return `${this.$config.staticBase}${this.$config.avatarBase}/${
        user.id % 10
      }.png`

    if (user.avatar.startsWith('http')) return user.avatar

    return this.$config.staticBase + user.avatar
  }

  grade(user: User) {
    if (!user.grade) return null

    if (user.grade < 13) return grades[user.grade].text

    return 'Graduated'
  }

  format(date: string | Date, formatString: string) {
    return formatDate(date, formatString)
  }

  async onPaymentComplete() {
    await this.$accessor.registrations.getStatuses(this.$route.params.id)
    await this.register()
  }

  async onCancelConfirm(status: EventRegistrationStatus) {
    await this.$accessor.registrations.delete(
      (status.registration as EventRegistration).id
    )

    await this.$accessor.registrations.getStatuses(this.$route.params.id)
  }

  async register() {
    await this.$accessor.registrations.create({
      eventId: +this.$route.params.id,
      users: this.selectedStatuses.map((s) => s.user.id),
    })

    if (this.$accessor.registrations.error) {
      console.error(this.$accessor.registrations.error)
    }

    await this.$accessor.registrations.getStatuses(this.$route.params.id)

    this.$accessor.snackbar.show({
      text: 'Registration Complete',
      color: '#66bb6a',
    })
    this.step = RegisterStep.SELECTION
  }
}
</script>

<style lang="scss">
.icon--bg {
  background-color: rgba(0, 0, 0, 0.1);
}

.picture--toolbar {
  background-color: transparent !important;
}
</style>
