<template>
  <div>
    <DialogConfirm ref="deleteDialog" @confirm="onDeleteConfirm">
      Deleting a user is a permanent action and cannot be undone. If you need to
      correct any information on the account please contact an administrator.
    </DialogConfirm>

    <DialogUserEdit ref="editDialog" />

    <v-card v-if="user.omcEmail" class="mb-4">
      <v-card-title>OMC Email</v-card-title>

      <v-card-subtitle>
        You have been given an OMC organization email.
      </v-card-subtitle>

      <v-card-text>
        <link-copy :text="user.omcEmail"></link-copy>
      </v-card-text>
    </v-card>

    <!-- Personal User Settings -->
    <v-card class="mb-4">
      <v-card-title>Personal Info</v-card-title>

      <VFormValidated v-slot="{ dirty }" @form:submit="onChangeSettings">
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <VTextFieldValidated v-model="first" rules="required" />
            </v-col>

            <v-col cols="6">
              <VTextFieldValidated v-model="last" rules="required" />
            </v-col>

            <v-col cols="12">
              <VTextFieldValidated v-model="email" rules="required" />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn v-if="dirty" text @click="$emit('form:reset')">
            Reset Changes
          </v-btn>

          <v-spacer />

          <v-btn type="submit">Save Changes</v-btn>
        </v-card-actions>
      </VFormValidated>
    </v-card>

    <!-- Account Users Card -->
    <v-card class="mb-4">
      <v-card-title>Account Users</v-card-title>

      <v-card-subtitle>
        Create or manage users within your account.
      </v-card-subtitle>

      <v-list rounded>
        <v-list-item v-for="usr in users" :key="usr.id">
          <v-list-item-avatar>
            <v-img :src="$avatar(usr)" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>
              {{ usr.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <span>{{ gender(usr) }}</span>
              <span v-if="typeof usr.grade === 'number'">
                <v-icon x-small>mdi-circle-medium</v-icon>
                {{ grades[usr.grade].text }}
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
                <v-list-item @click="editDialog && editDialog.open(usr)">
                  <v-list-item-icon>
                    <v-icon>mdi-account-edit</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item
                  v-if="primary.id !== usr.id"
                  @click="deleteDialog && deleteDialog.open(usr)"
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

      <v-card-actions>
        <v-spacer />

        <DialogCreateUser v-slot="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on">Add User</v-btn>
        </DialogCreateUser>
      </v-card-actions>
    </v-card>

    <!-- Notifications Card -->
    <v-card class="mb-4">
      <v-card-title>Notifications</v-card-title>

      <v-card-subtitle>
        Change the frequency or disable reminder emails for registered events.
      </v-card-subtitle>

      <v-card-text>
        <v-select
          :value="user.reminders"
          :items="reminders"
          label="Reminders"
          multiple
          chips
          clearable
          hide-details
          outlined
          @input="handleChangeReminders"
        >
        </v-select>
      </v-card-text>
    </v-card>

    <!-- Password Changing Card -->
    <v-card v-if="isPrimary" class="mb-4">
      <v-card-title>Change Password</v-card-title>

      <v-card-subtitle>Change the password on the account.</v-card-subtitle>

      <v-form-validated @submit:form="handleChangePassword">
        <!-- Hidden, but included or accessibility reasons. -->
        <!-- https://www.chromium.org/developers/design-documents/create-amazing-password-forms -->
        <input hidden type="text" autocomplete="email" />

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <VTextFieldValidated
                v-model="curPassword"
                label="Original Password"
                type="password"
                rules="required"
                autocomplete="current-password"
                outlined
                hide-details="auto"
              />
            </v-col>

            <v-col cols="12">
              <VTextFieldValidated
                v-model="newPassword"
                label="New Password"
                type="password"
                rules="required"
                autocomplete="new-password"
                vid="password"
                outlined
                hide-details="auto"
              />
            </v-col>

            <v-col cols="12">
              <VTextFieldValidated
                v-model="confirm"
                label="Confirm New Password"
                type="password"
                autocomplete="new-password"
                rules="required|password:@password"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn
            :loading="$accessor.users.isLoading"
            color="primary"
            type="submit"
            >Change Password
          </v-btn>
        </v-card-actions>
      </v-form-validated>
    </v-card>
  </div>
</template>

<script lang="ts">
import { ReminderFreq } from '@server/user/enums/reminder-freq.enum'
import {
  defineComponent,
  ref,
  reactive,
  computed,
  useContext,
  toRefs,
} from '@nuxtjs/composition-api'
import { User } from '@server/user/user.entity'
import { genders, reminders } from '~/utils/constants'
import { grades } from '~/utils/events'
import DialogConfirm from '~/components/dialog/Confirm.vue'
import DialogUserEdit from '~/components/dialog/UserEdit.vue'
import { DTOUser } from '~/store/users'
import useStateReset from '~/composables/useStateReset'

export default defineComponent({
  transition: 'slide-left',
  setup() {
    const { $accessor: store, $snack: snackbar } = useContext()
    const editDialog = ref<InstanceType<typeof DialogUserEdit>>()
    const deleteDialog = ref<InstanceType<typeof DialogConfirm>>()

    const user = computed(() => store.auth.user!)
    const users = computed(() => store.auth.account?.users || [])
    const primary = computed(() => store.auth.account!.primaryUser)
    const isPrimary = computed(() => store.auth.isPrimary)

    const state = reactive({
      reminders: [] as ReminderFreq[],
      confirm: '',
      newPassword: '',
      curPassword: '',
    })

    const { state: userSettings } = useStateReset({
      first: user.value.first,
      last: user.value.last,
      dob: user.value.dob,
      email: user.value.email,
      grade: user.value.grade,
    })

    const handleChangePassword = async () => {
      await store.auth.changePassword({
        curPassword: state.curPassword,
        newPassword: state.newPassword,
      })

      if (store.auth.isErrored) {
        return snackbar(
          store.auth.error?.status === 400
            ? 'Current password is incorrect'
            : store.users.error!.message,
          10000
        )
      }

      await store.auth.getMe()

      state.confirm = ''
      state.curPassword = ''
      state.newPassword = ''

      snackbar('Successfully Updated')
    }

    const handleChangeReminders = async (reminders: ReminderFreq[]) => {
      await store.users.updateOwn({
        id: user.value.id,
        updateOwnUserDto: { reminders },
      })

      if (store.users.isErrored) {
        snackbar(store.users.error!.message, 10000)
      } else {
        await store.auth.getMe()

        snackbar('Successfully Updated')
      }
    }

    const onChangeSettings = () => {
      console.log('Settings Submit')
    }

    const onDeleteConfirm = async (user: User) => {
      await store.users.delete(user.id)
      await store.auth.getAccount()
    }

    const gender = (user: DTOUser) =>
      genders.find((gender) => gender.value === user.gender)?.text

    return {
      ...toRefs(state),
      ...toRefs(userSettings),
      genders,
      reminders,
      grades,
      user,
      users,
      primary,
      isPrimary,
      handleChangePassword,
      handleChangeReminders,
      onChangeSettings,
      onDeleteConfirm,
      gender,
      editDialog,
      deleteDialog,
    }
  },
  head: {
    title: 'Account Settings',
  },
})
</script>
