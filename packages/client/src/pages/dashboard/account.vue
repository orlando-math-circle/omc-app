<template>
  <div>
    <v-card>
      <DialogConfirm ref="deleteDialog" @confirm="onDeleteConfirm">
        Deleting a user is a permanent action and cannot be undone. If you need
        to correct any information on the account please contact an
        administrator.
      </DialogConfirm>

      <DialogUpdateUser ref="editDialog" @user:update="onUpdateUser" />

      <v-card-title>Account Management</v-card-title>
      <v-card-subtitle
        >Add or manage child users on the account.</v-card-subtitle
      >

      <v-card-text>
        <v-list rounded>
          <v-list-item v-for="user in users" :key="user.id">
            <v-list-item-avatar>
              <v-img :src="user.avatarUrl" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ user.name }}</v-list-item-title>

              <v-list-item-subtitle>
                <span>{{ gender(user) }}</span>

                <span v-if="typeof user.grade === 'number'">
                  <v-icon small>mdi-circle-medium</v-icon>
                  {{ grades[user.grade].text }}
                </span>

                <span
                  v-if="
                    statuses.find((s) => s.user.id === user.id && s.isMember)
                  "
                >
                  <v-icon small>mdi-circle-medium</v-icon>
                  Member
                </span>
              </v-list-item-subtitle>

              <v-list-item-subtitle>
                <span>
                  <v-icon x-small>mdi-star-four-points-outline</v-icon>
                  {{ user.points }} Points
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-menu offset-y transition="slide-y-transition">
                <template #activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-cog-outline</v-icon>
                  </v-btn>
                </template>

                <v-list dense nav>
                  <v-list-item @click="editDialog && editDialog.open(user)">
                    <v-list-item-icon>
                      <v-icon>mdi-account-edit</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item
                    v-if="primary.id !== user.id"
                    @click="deleteDialog && deleteDialog.open(user)"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-delete-alert-outline</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <DialogCreateUser>
          <template #activator="{ on, attrs }">
            <v-btn block rounded color="secondary" v-bind="attrs" v-on="on">
              Add User
            </v-btn>
          </template>
        </DialogCreateUser>
      </v-card-actions>
    </v-card>

    <!-- Membership Signup -->
    <v-row v-if="nonMemberStatuses.length" class="mt-3">
      <v-col cols="12">
        <v-stepper v-model="step">
          <v-stepper-items>
            <v-stepper-content class="pa-0" step="1">
              <v-card>
                <v-card-title>Membership</v-card-title>

                <v-card-subtitle>
                  Select the account users you wish to register for a
                  membership.
                </v-card-subtitle>

                <v-card-text>
                  <v-list rounded>
                    <v-list-item-group
                      v-model="selectedUserIndices"
                      multiple
                      active-class="primary--text"
                    >
                      <v-list-item
                        v-for="status in nonMemberStatuses"
                        :key="status.user.id"
                        :disabled="status.user.feeWaived || !status.fee"
                      >
                        <template #default="{ active }">
                          <v-list-item-avatar>
                            <v-img :src="status.user.avatarUrl" />
                          </v-list-item-avatar>

                          <v-list-item-content>
                            <v-list-item-title>
                              {{ status.user.name }}
                            </v-list-item-title>

                            <v-list-item-subtitle v-if="status.user.feeWaived">
                              Membership Fee Waived
                            </v-list-item-subtitle>

                            <v-list-item-subtitle v-else-if="!status.fee">
                              <span v-if="!status.user.grade">
                                Ineligible • User Grade Missing
                              </span>

                              <span v-else>Ineligible</span>
                            </v-list-item-subtitle>

                            <v-list-item-subtitle v-else>
                              Eligible • ${{ status.fee }}
                            </v-list-item-subtitle>
                          </v-list-item-content>

                          <v-list-item-action
                            v-if="!status.user.feeWaived && status.fee"
                          >
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

                  <!-- Unlike event registrations, if there is no checkout cost
                  the user is likely fee-waived or can't become a member -->
                  <v-btn
                    v-else-if="
                      !selectedUserIndices.length || checkoutCost === 0
                    "
                    rounded
                    block
                    disabled
                  >
                    Select Users
                  </v-btn>

                  <v-btn v-else rounded block color="primary" @click="step++">
                    Continue to Payment
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>

            <v-stepper-content class="pa-0" step="2">
              <v-card :loading="isLoading">
                <v-card-title>Payment Due: ${{ checkoutCost }}</v-card-title>

                <v-card-text>
                  <PaymentMembership
                    :user-ids="selectedUserIds"
                    @payment:complete="onPaymentComplete"
                  />
                </v-card-text>

                <v-card-actions>
                  <v-btn text @click="step--">Change Users</v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  toRefs,
  reactive,
} from '@nuxtjs/composition-api'
import { useAuth, UserEntity, useUsers, useMembership } from '~/stores'
import DialogUpdateUser from '~/components/dialog/UpdateUser.vue'
import DialogConfirm from '~/components/dialog/Confirm.vue'
import { genders } from '~/utils/constants'
import { grades } from '~/utils/events'
import { useSnackbar } from '~/composables'

enum RegisterStep {
  SELECTION = 1,
  PAYMENT = 2,
  COMPLETION = 3,
}

export default defineComponent({
  transition(_to, from) {
    return from?.name === 'dashboard' ? 'slide-right' : 'slide-left'
  },
  setup() {
    const editDialog = ref<InstanceType<typeof DialogUpdateUser>>()
    const deleteDialog = ref<InstanceType<typeof DialogConfirm>>()

    const authStore = useAuth()
    const userStore = useUsers()
    const membershipStore = useMembership()
    const snackbar = useSnackbar()

    const state = reactive({
      selectedUserIndices: [] as number[],
      membership: null as number | null,
      step: RegisterStep.SELECTION,
    })

    const users = computed(() => authStore.accountUsers || [])
    const statuses = computed(() => membershipStore.statuses)
    const isLoading = computed(() => membershipStore.isLoading)

    const nonMemberStatuses = computed(() =>
      statuses.value.filter((s) => !s.isMember)
    )

    const selectedUserIds = computed(() =>
      state.selectedUserIndices.map((s) => users.value[s].id)
    )

    const selectedStatuses = computed(() =>
      statuses.value.filter((s) => selectedUserIds.value.includes(s.user.id))
    )

    const checkoutCost = computed(() =>
      selectedStatuses.value.reduce((cost, status) => {
        return cost + ((status.fee && parseFloat(status.fee)) || 0)
      }, 0)
    )

    const gender = (user: UserEntity) =>
      genders.find((gender) => gender.value === user.gender)?.text

    const grade = (user: UserEntity) => {
      if (!user.grade) return null

      if (user.grade < 13) return grades[user.grade].text

      return 'Graduated'
    }

    const onDeleteConfirm = async (user: UserEntity) => {
      await userStore.delete(user.id)

      snackbar.success('User deleted')

      await authStore.getMyAccount()
    }

    const onPaymentComplete = async () => {
      await membershipStore.findStatuses()
    }

    const onUpdateUser = async () => {
      await Promise.all([
        authStore.getMyAccount(),
        membershipStore.findStatuses(),
      ])
    }

    return {
      ...toRefs(state),
      gender,
      grade,
      grades,
      editDialog,
      deleteDialog,
      users,
      selectedUserIds,
      selectedStatuses,
      onPaymentComplete,
      checkoutCost,
      isLoading,
      isVerified: computed(() => authStore.isVerified),
      primary: computed(() => authStore.primaryUser!),
      onDeleteConfirm,
      onUpdateUser,
      statuses,
      nonMemberStatuses,
    }
  },
  async asyncData({ pinia }) {
    await useMembership(pinia).findStatuses()
  },
})
</script>
