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

            <DialogLightbox :image="picture">
              <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-sheet class="pa-2 rounded">
                    <v-icon>mdi-open-in-new</v-icon>
                  </v-sheet>
                </v-btn>
              </template>
            </DialogLightbox>
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

        <template v-if="event.description && event.description.length">
          <v-card-title>Description</v-card-title>

          <v-card-text>
            <span>{{ event.description }}</span>
          </v-card-text>
        </template>
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
                  <v-img :src="status.user.avatarUrl" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ status.user.name }}</v-list-item-title>

                  <v-list-item-subtitle
                    v-if="
                      status.registration &&
                      status.registration.volunteering &&
                      !status.registration.isCoverable
                    "
                  >
                    Volunteering
                  </v-list-item-subtitle>

                  <v-list-item-subtitle
                    v-else-if="
                      status.registration && status.registration.isCoverable
                    "
                  >
                    Pending Volunteer Swap
                  </v-list-item-subtitle>

                  <v-list-item-subtitle v-else-if="!status.eligible">
                    Not Eligible
                  </v-list-item-subtitle>

                  <v-list-item-subtitle v-else-if="status.user.grade">
                    Eligible • {{ grade(status.user) }}
                  </v-list-item-subtitle>

                  <v-list-item-subtitle v-else>Eligible</v-list-item-subtitle>
                </v-list-item-content>

                <v-menu offset-y transition="slide-y-transition">
                  <template #activator="{ on, attrs }">
                    <v-btn color="primary" v-bind="attrs" v-on="on">
                      Manage
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>

                  <v-list dense nav>
                    <v-list-item
                      v-if="
                        status.registration && status.registration.volunteering
                      "
                      @click="handleSwapDialog(status)"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-swap-horizontal</v-icon>
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title
                          v-if="
                            status.registration &&
                            status.registration.isCoverable
                          "
                          >Cancel Swap</v-list-item-title
                        >
                        <v-list-item-title
                          v-else-if="
                            status.registration &&
                            !status.registration.isCoverable
                          "
                          >Request Swap</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item
                      @click="cancelDialog && cancelDialog.open(status)"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-minus-circle-outline</v-icon>
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title>Cancel</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-expand-transition>

    <!-- Attendance Process (volunteer and regular) -->
    <v-col v-if="isClosed && registeredUsers.length">
      <v-card>
        <v-card-title>Attendance</v-card-title>
        <v-card-subtitle> Mark attendance to the event. </v-card-subtitle>
        <v-list rounded>
          <v-col v-for="status in registeredUsers" :key="status.user.id">
            <v-list-item>
              <v-list-item-avatar>
                <v-img :src="status.user.avatarUrl" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ status.user.name }}</v-list-item-title>

                <v-list-item-subtitle
                  v-if="status.registration && status.registration.volunteering"
                >
                  Volunteering
                </v-list-item-subtitle>

                <v-list-item-subtitle v-else-if="!status.eligible">
                  Not Eligible
                </v-list-item-subtitle>

                <v-list-item-subtitle v-else-if="status.user.grade">
                  Eligible • {{ grade(status.user) }}
                </v-list-item-subtitle>

                <v-list-item-subtitle v-else>Eligible</v-list-item-subtitle>
              </v-list-item-content>

              <VFormValidated
                v-if="
                  status.registration &&
                  status.registration.volunteering &&
                  !attendedUsers.length
                "
                ref="attendanceVolunteerForm"
                @form:submit="onSubmitVolunteerAttendance(status.user.id)"
              >
                <v-card-actions>
                  <v-list-item>
                    <v-col cols="12">
                      <VTextFieldValidated
                        v-model.number="attendance.hours"
                        rules="required"
                        label="Hours"
                        hint="Hours of work completed"
                        outlined
                        hide-details="auto"
                      />
                    </v-col>
                  </v-list-item>
                  <v-spacer />
                  <v-list-item>
                    <v-col cols="12">
                      <v-select
                        v-model="attendance.job"
                        :items="jobs"
                        label="Job (Optional)"
                        outlined
                        hide-details="auto"
                      />
                    </v-col>
                  </v-list-item>
                  <v-btn type="submit" color="primary">
                    Submit Volunteer Attendance
                  </v-btn>
                </v-card-actions>
              </VFormValidated>

              <VFormValidated
                v-if="
                  status.registration &&
                  !status.registration.volunteering &&
                  !attendedUsers.length
                "
                ref="attendanceForm"
                @form:submit="onSubmitAttendance(status.user.id)"
              >
                <v-card-actions>
                  <v-spacer />

                  <v-btn type="submit" color="primary">
                    Submit Attendance
                  </v-btn>
                </v-card-actions>
              </VFormValidated>

              <v-list-item-action v-if="attendedUsers.length">
                <v-btn
                  v-for="startus in attendedUsers"
                  :key="startus.attendance.id"
                  text
                  @click="
                    cancelAttendanceDialog &&
                      cancelAttendanceDialog.open(startus)
                  "
                >
                  Remove Attendance
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-col>
        </v-list>
      </v-card>
    </v-col>

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

              <v-card-subtitle>
                Select the account users you wish to register to the event.
              </v-card-subtitle>

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
                          <v-img :src="status.user.avatarUrl" />
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

                          <v-list-item-subtitle v-else>
                            Eligible
                          </v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-action v-if="status.eligible">
                          <v-checkbox :input-value="active" />
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card-text>

              <v-card-actions>
                <v-btn v-if="!isVerified" disabled rounded block>
                  Email Verification Required
                </v-btn>

                <v-btn
                  v-else-if="!selections.length"
                  rounded
                  block
                  disabled
                  @click="onRegister"
                >
                  Select Users
                </v-btn>

                <v-btn
                  v-else-if="checkoutCost === 0"
                  rounded
                  block
                  color="primary"
                  @click="onRegister"
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
            <v-card :loading="isPayPalLoading">
              <v-card-title>Payment Due: ${{ checkoutCost }}</v-card-title>

              <v-card-text>
                <PaymentPaypal
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
        </v-stepper-items>
      </v-stepper>
    </v-col>

    <!-- Volunteering Process -->
    <v-col v-if="unregisteredVolunteers.length && !isClosed" cols="12">
      <v-card>
        <v-card-title>Volunteering</v-card-title>

        <v-card-subtitle>
          When registering to volunteer you may also optionally select a job.
          The list is not exhaustive, and you can submit a volunteer work order
          on the account page anytime.
        </v-card-subtitle>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="volunteer"
                :items="unregisteredVolunteers"
                outlined
                item-value="user.id"
                label="Select User"
                hide-details="auto"
              >
                <template #selection="data">
                  <v-chip v-bind="data.attrs">
                    <v-avatar left>
                      <v-img :src="data.item.user.avatarUrl" />
                    </v-avatar>

                    {{ data.item.user.name }}
                  </v-chip>
                </template>

                <template #item="data">
                  <v-list-item-avatar>
                    <v-img :src="data.item.user.avatarUrl" />
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{
                      data.item.user.name
                    }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      data.item.user.email || 'No email'
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-select>
            </v-col>

            <v-col v-if="!volunteerJob && swappableVolunteers.length" cols="12">
              <VSelectValidated
                v-model="swap"
                :items="swappableVolunteers"
                label="Cover another shift"
                item-value="id"
                clearable
              >
                <template #selection="{ item, attrs }">
                  <v-chip v-bind="attrs">
                    <v-avatar left>
                      <v-img :src="item.user.avatarUrl" />
                    </v-avatar>

                    <span>{{ item.user.name }}</span>
                  </v-chip>
                </template>

                <template #item="{ item }">
                  <v-list-item-avatar>
                    <v-img :src="item.user.avatarUrl" />
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.user.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      item.user.email || 'No email'
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </VSelectValidated>
            </v-col>

            <v-col v-if="!swap" cols="12">
              <v-select
                v-model="volunteerJob"
                :items="jobs"
                label="Job (Optional)"
                outlined
                hide-details="auto"
                clearable
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn
            :disabled="!volunteer"
            rounded
            block
            color="primary"
            @click="onVolunteer"
          >
            Complete Registration
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <DialogConfirm ref="cancelDialog" @confirm="onCancel">
      You may register again at any time.
    </DialogConfirm>

    <DialogConfirm ref="swapDialog" @confirm="onSwapToggle">
      This action will mark your volunteering registration as needing covered,
      allowing the shift to be swapped to another volunteer.
    </DialogConfirm>

    <DialogConfirm ref="cancelAttendanceDialog" @confirm="onAttendanceCancel">
      Are you sure you want to delete your attendance?
    </DialogConfirm>
  </v-row>
</template>

<script lang="ts">
import { User } from '@server/user/user.entity'
import { EventRegistrationStatus } from '@server/event-registration/dtos/event-registration-status.dto'
import { Roles } from '@server/app.roles'
import { Gender } from '@server/user/enums/gender.enum'
import { VolunteerJob } from '@server/volunteer-job/volunteer-job.entity'
import {
  useRegistrations,
  useEvents,
  useAuth,
  usePayPal,
  UserEntity,
  useAttendance,
} from '@/stores'
import DialogConfirm from '@/components/dialog/Confirm.vue'
import { contiguousGradeRanges, gradeGroups, grades } from '@/utils/events'
import { formatDate } from '@/utils/utilities'
import {
  computed,
  defineComponent,
  reactive,
  ref,
  toRefs,
  useContext,
  useRoute,
} from '@nuxtjs/composition-api'
import { useSnackbar, useStateReset } from '@/composables'
import { AttendanceStatus } from '@server/attendance/dtos/attendance-status.dto'
import { Attendance } from '@server/attendance/attendance.entity'
import { EntityDTO } from '@server/shared/types/entity-dto'

enum RegisterStep {
  SELECTION = 1,
  PAYMENT = 2,
  COMPLETION = 3,
}

export default defineComponent({
  setup() {
    const cancelDialog = ref<InstanceType<typeof DialogConfirm>>()
    const cancelAttendanceDialog = ref<InstanceType<typeof DialogConfirm>>()
    const swapDialog = ref<InstanceType<typeof DialogConfirm>>()

    const { $config } = useContext()
    const route = useRoute()
    const eventStore = useEvents()
    const authStore = useAuth()
    const payPalStore = usePayPal()
    const registrationStore = useRegistrations()
    const snackbar = useSnackbar()
    const attendanceStore = useAttendance()

    const state = reactive({
      selections: [] as number[],
      volunteer: null as number | null,
      volunteerJob: null as number | null,
      swap: null as number | null,
      isUserCancel: true,
      step: RegisterStep.SELECTION,
    })

    const format = (date: string | Date, formatString: string) =>
      formatDate(date, formatString)

    const event = computed(() => eventStore.event!)
    const date = computed(() => format(event.value.dtstart, 'EEE, LLL d, yyyy'))
    const times = computed(
      () =>
        `${format(event.value.dtstart, 'h:mm a')} - ${format(
          event.value.dtend,
          'h:mm a'
        )}`
    )
    const picture = computed(() => {
      const url = event.value.picture ?? event.value?.project?.picture

      if (!url) return eventStore.defaultPicture

      if (url.startsWith('http')) return url

      return `${$config.staticBase}${url}`
    })

    const statuses = computed(() => registrationStore.statuses)

    const selectedStatuses = computed(() =>
      state.selections.map((s) => statuses.value[s])
    )

    const volunteerUsers = computed(() =>
      statuses.value.filter((u) => u.user.roles.includes(Roles.VOLUNTEER))
    )

    const unregisteredVolunteers = computed(() =>
      volunteerUsers.value.filter((u) => u.registration === false)
    )

    const attendanceStatuses = computed(() => attendanceStore.statuses)

    const fee = computed(() => {
      if (event.value.course?.fee) {
        if (event.value.course.isLate) {
          return event.value.course.fee.lateAmount
        } else {
          return event.value.course.fee.amount
        }
      } else if (event.value.fee) {
        if (event.value.isLate) {
          return event.value.fee.lateAmount
        } else {
          return event.value.fee.amount
        }
      }
    })

    const isLate = computed(
      () => event.value.course?.isLate || event.value.isLate
    )

    const checkoutCost = computed(() => {
      if (typeof fee.value !== 'string') return 0

      const feeNum = parseFloat(fee.value) || 0
      return feeNum * usersRequiringPayment.value.length
    })

    const usersRequiringPayment = computed(() => {
      const retval: EntityDTO<User>[] = []

      for (const status of selectedStatuses.value) {
        if (status.paid || status.user.feeWaived) continue

        retval.push(status.user)
      }

      return retval
    })

    const jobs = computed(() => [
      ...((event.value.project?.jobs as unknown as VolunteerJob[]) || []).map(
        (j) => ({
          text: j.name,
          value: j.id,
        })
      ),
      {
        text: 'Other...',
        value: null,
      },
    ])

    const perms = computed(() => {
      if (!event.value.permissions) return

      const { genders, grades } = event.value.permissions

      let title: string | null = null
      let subtitle: string | null = null

      if (grades?.length) {
        const ranges = gradeGroups(contiguousGradeRanges(grades))

        title = ranges.join(', ')
      } else {
        title = 'All Grade Levels'
      }

      // If both male and female are selected, don't show anything.
      if (genders?.length === 1) {
        const str = genders[0] === Gender.MALE ? 'Boys Only' : 'Girls Only'

        subtitle = str
      } else {
        subtitle = 'Boys and Girls'
      }

      return { title, subtitle }
    })

    const registeredUsers = computed(() =>
      statuses.value.filter((s) => s.registration !== false)
    )

    const unregisteredUsers = computed(() =>
      statuses.value.filter((s) => s.registration === false)
    )

    const attendedUsers = computed(() =>
      attendanceStatuses.value.filter((s) => s.attended !== false)
    )
    
    const swappableVolunteers = computed(() =>
      registrationStore.registrations.filter((r) => r.isCoverable)
    )

    const isClosed = computed(
      () => !!(event.value.isClosed || event.value.course?.isClosed)
    )

    const grade = (user: UserEntity) => {
      if (!user.grade) return null

      if (user.grade < 13) return grades[user.grade].text

      return 'Graduated'
    }

    const onRegister = async () => {
      await registrationStore.create({
        eventId: +route.value.params.id,
        users: selectedStatuses.value.map((s) => s.user.id),
      })

      if (registrationStore.error) {
        return snackbar.error(registrationStore.error.message)
      }

      await registrationStore.findStatuses(+route.value.params.id)

      state.selections = []
      snackbar.success('Registration Complete')
      state.step = RegisterStep.SELECTION
    }

    const onVolunteer = async () => {
      if (state.swap) {
        await registrationStore.swap(state.swap)
      } else {
        await registrationStore.create(
          {
            eventId: +route.value.params.id,
            users: [
              {
                userId: state.volunteer!,
                job: state.volunteerJob || undefined,
              },
            ],
          },
          true
        )
      }

      if (registrationStore.error) {
        return snackbar.error(registrationStore.error.message)
      }

      await registrationStore.findStatuses(+route.value.params.id)
      snackbar.success('Registration Complete')

      state.volunteer = null
      state.swap = null
      state.volunteerJob = null
    }

    const { state: attendance, reset: resetAttendanceState } = useStateReset({
      hours: 0,
      job: undefined,
    })

    const onSubmitVolunteerAttendance = async (id: number) => {
      await attendanceStore.create({
        ...attendance,
        attended: true,
        userId: id,
        eventId: +route.value.params.id,
        hours: attendance.hours,
        jobId: attendance.job,
        workId: 1,
      })

      if (attendanceStore.error) {
        return snackbar.error(attendanceStore.error.message)
      }
      await attendanceStore.findStatuses(+route.value.params.id)

      snackbar.success('Attendance submitted!')
      resetAttendanceState()
    }

    const onSubmitAttendance = async (id: number) => {
      await attendanceStore.create({
        attended: true,
        userId: id,
        eventId: +route.value.params.id,
        hours: 0,
        jobId: 0,
        workId: 0,
      })

      if (attendanceStore.error) {
        return snackbar.error(attendanceStore.error.message)
      }
      await attendanceStore.findStatuses(+route.value.params.id)

      snackbar.success('Attendance submitted!')
      resetAttendanceState()
    }

    const onPaymentComplete = async () => {
      await Promise.all([
        registrationStore.findStatuses(+route.value.params.id),
        onRegister(),
      ])
    }

    const onSwapToggle = async (status: EntityDTO<EventRegistrationStatus>) => {
      if (!status.registration) return

      await registrationStore.update(status.registration.id, {
        isCoverable: !status.registration.isCoverable,
      })

      if (registrationStore.error) {
        snackbar.error(registrationStore.error.message)
      } else {
        snackbar.success('Registration Updated')
      }

      await registrationStore.findStatuses(+route.value.params.id)
    }

    const onAttendanceCancel = async (status: AttendanceStatus) => {
      await attendanceStore.delete((status.attendance as Attendance).id)

      if (attendanceStore.error) {
        snackbar.error(attendanceStore.error.message)
      }
      await attendanceStore.findStatuses(+route.value.params.id)

      snackbar.success('Attendance removed!')
    }

    const onCancel = async (status: EntityDTO<EventRegistrationStatus>) => {
      if (!status.registration) return

      await registrationStore.delete(status.registration.id)

      if (registrationStore.error) {
        snackbar.error(registrationStore.error.message)
      }

      await registrationStore.findStatuses(+route.value.params.id)
    }

    const handleSwapDialog = (status: EntityDTO<EventRegistrationStatus>) => {
      if (!status.registration) return

      // If the status is already set to coverable, skip the dialog.
      if (status.registration?.isCoverable) {
        return onSwapToggle(status)
      }

      swapDialog.value?.open(status)

    }

    return {
      ...toRefs(state),
      cancelDialog,
      cancelAttendanceDialog,
      swapDialog,
      event,
      date,
      times,
      picture,
      fee,
      isLate,
      jobs,
      checkoutCost,
      attendance,
      perms,
      isClosed,
      isVerified: computed(() => authStore.isVerified),
      isPayPalLoading: computed(() => payPalStore.isLoading),
      grade,
      usersRequiringPayment,
      registeredUsers,
      unregisteredUsers,
      unregisteredVolunteers,
      attendedUsers,
      swappableVolunteers,
      handleSwapDialog,
      onPaymentComplete,
      onSwapToggle,
      onCancel,
      onAttendanceCancel,
      onRegister,
      onVolunteer,
      onSubmitAttendance,
      onSubmitVolunteerAttendance,
    }
  },
  async asyncData({ pinia, route }) {
    const eventStore = useEvents(pinia)
    const registrationStore = useRegistrations(pinia)
    const attendanceStore = useAttendance(pinia)

    await Promise.all([
      eventStore.findOne(+route.params.id),
      registrationStore.findStatuses(+route.params.id),
      attendanceStore.findStatuses(+route.params.id),
      registrationStore.findAll({ coverable: true }),
    ])
  },
  head: {
    title: 'Event Details',
  },
})
</script>

<style lang="scss">
.icon--bg {
  background-color: rgba(0, 0, 0, 0.1);
}

.picture--toolbar {
  background-color: transparent !important;
}
</style>
