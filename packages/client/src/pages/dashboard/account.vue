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
                  <v-icon x-small>mdi-circle-medium</v-icon>
                  {{ grades[user.grade].text }}
                </span>
                <span v-if="user.activeMember">
                  <v-icon x-small>mdi-circle-medium</v-icon>
                  Member
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
            <v-btn block rounded v-bind="attrs" v-on="on">Add User</v-btn>
          </template>
        </DialogCreateUser>
      </v-card-actions>
    </v-card>

    <v-col v-if="unregisteredMembers.length" cols="12">
      <v-stepper v-model="step">
        <v-stepper-items>
          <v-stepper-content class="pa-0" step="1">
            <v-card>
              <v-card-title>Membership</v-card-title>

              <v-card-subtitle
                >Select the account users you wish to register for a
                membership.</v-card-subtitle
              >

              <v-card-text>
                <v-list rounded>
                  <v-list-item-group
                    v-model="selections"
                    multiple
                    active-class="primary--text"
                  >
                    <v-list-item
                      v-for="member in unregisteredMembers"
                      :key="member.id"
                      :disabled="member.activeMember"
                    >
                      <template #default="{ active }">
                        <v-list-item-avatar>
                          <v-img :src="member.avatarUrl" />
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>
                            {{ member.name }}
                          </v-list-item-title>

                          <v-list-item-subtitle v-if="member.grade">
                            <span>Eligible</span>
                            <span>• {{ grade(member) }}</span>
                          </v-list-item-subtitle>
                          <v-list-item-subtitle v-else
                            >Eligible</v-list-item-subtitle
                          >
                        </v-list-item-content>

                        <v-list-item-action v-if="!member.activeMember">
                          <v-checkbox :input-value="active" />
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card-text>

              <v-card-actions>
                <v-btn v-if="!isVerified" disabled rounded block
                  >Email Verification Required</v-btn
                >

                <v-btn
                  v-else-if="!selections.length"
                  rounded
                  block
                  disabled
                  @click="onRegister"
                  >Select Users</v-btn
                >

                <v-btn
                  v-else-if="checkoutCost === 0"
                  rounded
                  block
                  color="primary"
                  @click="onRegister"
                  >Complete Registration</v-btn
                >

                <v-btn v-else rounded block color="primary" @click="step++"
                  >Continue to Payment</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-content class="pa-0" step="2">
            <v-card :loading="isPayPalLoading">
              <v-card-title>Payment Due: ${{ checkoutCost }}</v-card-title>

              <v-card-text>
                <PaymentMemberPaypal
                  :users="selectedUsers"
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
  </div>
</template>

<script lang="ts">
import { User } from '@server/user/user.entity'
import {
  defineComponent,
  ref,
  computed,
  toRefs,
  reactive,
  useRoute,
} from '@nuxtjs/composition-api'
import {
  useAuth,
  UserEntity,
  useUsers,
  useMemberPayPal,
  useMembership,
} from '@/stores'
import DialogUpdateUser from '@/components/dialog/UpdateUser.vue'
import DialogConfirm from '@/components/dialog/Confirm.vue'
import { genders } from '@/utils/constants'
import { grades } from '@/utils/events'
import { useSnackbar } from '@/composables'

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
    const authStore = useAuth()
    const userStore = useUsers()
    const route = useRoute()
    const membershipStore = useMembership()
    const payPalStore = useMemberPayPal()
    const snackbar = useSnackbar()

    const state = reactive({
      selections: [] as number[],
      membership: null as number | null,
      step: RegisterStep.SELECTION,
    })

    const fee = computed(() => {
      return '50.00'
    })

    const checkoutCost = computed(() => {
      if (typeof fee.value !== 'string') return 0
      const feeNum = parseFloat(fee.value) || 0
      return feeNum
    })

    const selectedUsers = computed(() =>
      state.selections.map((s) => users.value[s].id)
    )
    const onRegister = async () => {
      await membershipStore.create({
        users: selectedUsers.value,
      })

      if (membershipStore.error) {
        return snackbar.error(membershipStore.error.message)
      }

      await authStore.getMyAccount()

      state.selections = []
      snackbar.success('Registration Complete')
      state.step = RegisterStep.SELECTION
    }

    const onPaymentComplete = async () => {
      await Promise.all([membershipStore.findMemberships(), onRegister()])
    }

    // what to do here
    const usersRequiringPayment = computed(() => {
      const retval: User[] = []

      for (const user of selectedUsers.value as User[]) {
        if (user?.membership?.active) continue

        retval.push(user)
      }

      return retval
    })

    const users = computed(() => authStore.accountUsers)

    const unregisteredMembers = computed(() =>
      users.value.filter((u: any) => !u.activeMember)
    )

    const registeredMembers = computed(() =>
      users.value.filter((u: any) => u.activeMember)
    )
    const editDialog = ref<InstanceType<typeof DialogUpdateUser>>()
    const deleteDialog = ref<InstanceType<typeof DialogConfirm>>()

    const gender = (user: UserEntity) =>
      genders.find((gender) => gender.value === user.gender)?.text

    const onDeleteConfirm = async (user: UserEntity) => {
      await userStore.delete(user.id)
      await authStore.getMyAccount()
    }
    const grade = (user: UserEntity) => {
      if (!user.grade) return null

      if (user.grade < 13) return grades[user.grade].text

      return 'Graduated'
    }

    const onUpdateUser = async () => await authStore.getMyAccount()

    return {
      ...toRefs(state),
      gender,
      grade,
      grades,
      editDialog,
      deleteDialog,
      users,
      selectedUsers,
      onRegister,
      onPaymentComplete,
      checkoutCost,
      isPayPalLoading: computed(() => payPalStore.isLoading),
      isVerified: computed(() => authStore.isVerified),
      unregisteredMembers,
      registeredMembers,
      usersRequiringPayment,
      primary: computed(() => authStore.primaryUser!),
      onDeleteConfirm,
      onUpdateUser,
    }
  },
})
</script>
