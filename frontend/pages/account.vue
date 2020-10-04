<template>
  <div>
    <v-row>
      <v-col justify="center" align="center"> </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-avatar size="120px" class="avatar">
          <v-img :src="user.avatar || '/images/default_avatars/paper.png'" />
        </v-avatar>

        <v-card class="pa-3 avatar-offset">
          <v-card-title>User Settings</v-card-title>

          <v-card-text>
            <v-text-field
              v-model="user.email"
              label="Email"
              readonly
              outlined
            ></v-text-field>

            <v-text-field
              :value="birthday"
              label="Birthday"
              readonly
              outlined
            ></v-text-field>

            <v-row no-gutters>
              <v-col>
                <v-select
                  chips
                  label="Roles"
                  :value="'Volunteer'"
                  :items="['Admin', 'Volunteer']"
                  outlined
                />
              </v-col>

              <v-col cols="4" class="ml-4">
                <v-text-field
                  :value="user.grade"
                  label="Grade Level"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- 
            <v-text-field label="Change Password"></v-text-field>
            <v-text-field label="Change Password"></v-text-field>
            <v-text-field label="Confirm New Password"></v-text-field> -->
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text>Change Email</v-btn>
            <v-btn text>Change Password</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card v-if="account" class="pa-3">
          <v-card-title class="mt-3"> Account Users </v-card-title>

          <v-card-subtitle> Manage users. </v-card-subtitle>

          <v-list>
            <v-list-item v-for="usr in otherUsers" :key="usr.id">
              <v-list-item-avatar>
                <v-img
                  :src="usr.avatar || '/images/default_avatars/paper.png'"
                ></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>
                  {{ usr.first }} {{ usr.last }}
                </v-list-item-title>
                <v-list-item-subtitle v-if="user.grade !== 13"
                  >Grade {{ user.grade }}</v-list-item-subtitle
                >
                <v-list-item-subtitle v-else>Adult</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon>
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-btn block color="primary">Add User</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Notification Settings</v-card-title>
          <v-card-subtitle
            >Change the frequency and type of notification
            emails.</v-card-subtitle
          >

          <v-list class="mx-3">
            <v-list-item-group>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Upcoming Events</v-list-item-title>
                  <v-list-item-subtitle
                    >Newsletter-style emails.</v-list-item-subtitle
                  >
                </v-list-item-content>

                <v-list-item-action>
                  <v-checkbox :value="false"></v-checkbox>
                </v-list-item-action>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-select
                      label="Reminders"
                      :items="[
                        '1 Day Before',
                        '1 Week Before',
                        '1 Hour Before',
                        '15 Minutes Before',
                      ]"
                      chips
                      hide-details
                    >
                    </v-select>
                  </v-list-item-title>
                  <v-list-item-subtitle
                    >Notification emails.</v-list-item-subtitle
                  >
                </v-list-item-content>

                <v-list-item-action>
                  <v-checkbox :value="false"></v-checkbox>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Payment History</v-card-title>
          <v-card-subtitle>Recent transactions</v-card-subtitle>

          <v-list two-line>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-currency-usd</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>Event Fees - $15.00</v-list-item-title>
                <v-list-item-subtitle
                  >Thursday, September 10th, 2020</v-list-item-subtitle
                >
                <v-list-item-subtitle>JavaScript Course</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-currency-usd</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>Event Fees - $50.00</v-list-item-title>
                <v-list-item-subtitle
                  >Saturday, August 1st, 2020</v-list-item-subtitle
                >
                <v-list-item-subtitle>Geometry Tutoring</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Reduced Lunch Form</v-card-title>
          <v-card-subtitle
            >Sudents on their school's free lunch program will have their
            registration fees waived. Attach a copy of a letter from the
            student's school district indicating they are on the free lunch
            program for approval.</v-card-subtitle
          >

          <v-card-text>
            <v-file-input
              prepend-icon="mdi-paperclip"
              label="File Upload"
            ></v-file-input>
            <span
              >If you require assistance feel free to bring a copy of the form
              in-person or email it to
              <a href="mailto:fake@email.com">fake@email.com</a></span
            >.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import { Vue, Component } from 'nuxt-property-decorator'
import { Account } from '~/../backend/src/account/account.entity'
import { User } from '~/../backend/src/user/user.entity'

@Component({
  head() {
    return {
      title: 'Account',
    }
  },
})
export default class AccountPage extends Vue {
  get user() {
    return this.$accessor.auth.user as User
  }

  get account() {
    return this.$accessor.auth.account as Account
  }

  // TODO: This is obnoxious, find a proper type for MikroORM Collections
  get accountUsers() {
    return (this.$accessor.auth.account!.users as unknown) as User[]
  }

  get otherUsers() {
    return this.accountUsers.filter((user) => user.id !== this.user.id)
  }

  get birthday() {
    return moment(this.user.dob).format('dddd, MMMM Do, YYYY')
  }

  async fetch() {
    await this.$accessor.auth.getAccount()
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  border: 4px solid #fff;
  position: absolute;
  top: 0%;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  z-index: 1;

  &-offset {
    margin-top: 40px;
  }
}

::v-deep
  .v-select.v-select--chips:not(.v-text-field--single-line).v-text-field--enclosed
  .v-select__selections {
  min-height: 48px;
}
</style>
