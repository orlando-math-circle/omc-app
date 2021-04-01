<template>
  <div>
    <v-card v-if="user.omcEmail" class="mb-4">
      <v-card-title>OMC Email</v-card-title>

      <v-card-subtitle>
        You have been given an OMC organization email.
      </v-card-subtitle>

      <v-card-text>
        <link-copy :text="user.omcEmail"></link-copy>
      </v-card-text>
    </v-card>

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
                <v-list-item @click="$refs.editDialog.open(usr)">
                  <v-list-item-icon>
                    <v-icon>mdi-account-edit</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item
                  v-if="primary && primary.id !== usr.id"
                  @click="$refs.deleteDialog.open(usr)"
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
        <v-spacer></v-spacer>

        <dialog-create-user v-slot="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on">Add User</v-btn>
        </dialog-create-user>
      </v-card-actions>
    </v-card>

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
          @input="onChangeReminders"
        >
        </v-select>
      </v-card-text>
    </v-card>

    <v-card class="mb-4">
      <v-card-title>Change Password</v-card-title>

      <v-card-subtitle>Change the password on the account.</v-card-subtitle>

      <v-form-validated @submit:form="onChangePassword">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field-validated
                v-model="passwords.curPassword"
                label="Original Password"
                type="password"
                rules="required"
                autocomplete="current-password"
                outlined
                hide-details="auto"
              ></v-text-field-validated>
            </v-col>

            <v-col cols="12">
              <v-text-field-validated
                v-model="passwords.newPassword"
                label="New Password"
                type="password"
                rules="required"
                autocomplete="new-password"
                vid="password"
                outlined
                hide-details="auto"
              ></v-text-field-validated>
            </v-col>

            <v-col cols="12">
              <v-text-field-validated
                v-model="passwords.confirm"
                label="Confirm New Password"
                type="password"
                autocomplete="new-password"
                rules="required|password:@password"
                outlined
                hide-details="auto"
              ></v-text-field-validated>
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

    <dialog-confirm ref="deleteDialog" @confirm="onDeleteConfirm">
      Deleting a user is a permanent action and cannot be undone. If you need to
      correct any information on the account please contact an administrator.
    </dialog-confirm>
    <dialog-user-edit ref="editDialog"></dialog-user-edit>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { User } from '@omc/server/user/user.entity'
import { ReminderFreq } from '@omc/server/user/enums/reminder-freq.enum'
import { grades } from '../../utils/events'
import { genders, reminders } from '../../utils/constants'
import DialogUserEdit from '~/components/dialogs/DialogUserEdit.vue'
import DialogConfirm from '~/components/dialogs/DialogConfirm.vue'

@Component({
  head: {
    title: 'Account Settings',
  },
  transition: 'slide-left',
})
export default class AccountSettingsPage extends Vue {
  $refs!: {
    editDialog: InstanceType<typeof DialogUserEdit>
    deleteDialog: InstanceType<typeof DialogConfirm>
  }

  grades = grades
  genders = genders
  reminders = reminders

  emails = {
    reminders: [] as ReminderFreq[],
  }

  passwords = {
    confirm: '',
    curPassword: '',
    newPassword: '',
  }

  async onChangePassword() {
    await this.$accessor.auth.changePassword({
      curPassword: this.passwords.curPassword,
      newPassword: this.passwords.newPassword,
    })

    if (this.$accessor.auth.isErrored) {
      if (this.$accessor.auth.error?.status === 400) {
        return this.$accessor.snackbar.show({
          text: 'Current password is incorrect',
          timeout: 10000,
        })
      }
      return this.$accessor.snackbar.show({
        text: this.$accessor.users.error!.message,
        timeout: 10000,
      })
    }

    await this.$accessor.auth.getMe()

    this.passwords.confirm = ''
    this.passwords.curPassword = ''
    this.passwords.newPassword = ''

    this.$accessor.snackbar.show({
      text: 'Successfully Updated',
    })
  }

  async onChangeReminders(reminders: ReminderFreq[]) {
    await this.$accessor.users.updateOwn({
      id: this.user.id,
      updateOwnUserDto: { reminders },
    })

    if (this.$accessor.users.isErrored) {
      this.$accessor.snackbar.show({
        text: this.$accessor.users.error!.message,
        timeout: 10000,
      })
    } else {
      await this.$accessor.auth.getMe()

      this.$accessor.snackbar.show({
        text: 'Successfully Updated',
      })
    }
  }

  get user() {
    return this.$accessor.auth.user!
  }

  get users() {
    return ((this.$accessor.auth.account?.users as unknown) as User[]) || []
  }

  get primary() {
    return this.$accessor.auth.account?.primaryUser
  }

  gender(user: User) {
    return this.genders.find((gender) => gender.value === user.gender)?.text
  }

  async onDeleteConfirm(user: User) {
    await this.$accessor.users.delete(user.id)
    await this.$accessor.auth.getAccount()
  }
}
</script>
