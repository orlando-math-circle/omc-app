<template>
  <v-container class="pa-6">
    <template v-if="user == null">
      <v-row>
        <v-col>
          <v-alert> Unable to retrieve the user. </v-alert>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row no-gutters class="mb-6">
        <v-col>
          <v-row>
            <v-col>
              <h1>Edit User — {{ user.name }}</h1>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="pt-0">
              <breadcrumbs
                class="pa-0"
                :items="breadcrumbs"
                large
              ></breadcrumbs>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="auto" align-self="center">
          <v-btn>Create User</v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card>
            <v-card-title>Basic Information</v-card-title>

            <v-card-text>
              <v-form-validated>
                <v-row>
                  <v-col cols="auto">
                    <div class="d-flex flex-column">
                      <v-col>
                        <v-avatar size="100px">
                          <v-img :src="user.avatar"></v-img>
                        </v-avatar>
                      </v-col>

                      <v-btn class="mt-1">Edit Avatar</v-btn>
                    </div>
                  </v-col>

                  <v-col>
                    <v-row>
                      <v-col class="py-0">
                        <v-text-field-validated
                          v-model="user.first"
                          rules="required"
                          outlined
                          required
                        ></v-text-field-validated>
                      </v-col>

                      <v-col class="py-0">
                        <v-text-field-validated
                          v-model="user.last"
                          rules="required"
                          outlined
                          required
                        ></v-text-field-validated>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col class="py-0">
                        <v-text-field-validated
                          v-model="user.email"
                          rules="email"
                          outlined
                        ></v-text-field-validated>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col class="mb-3">
                        <birthday-picker
                          v-model="user.dob"
                          outlined
                        ></birthday-picker>
                      </v-col>
                    </v-row>

                    <v-row no-gutters>
                      <v-col>
                        <v-checkbox
                          v-model="user.emailVerified"
                          class="ma-0"
                          label="Email Verified"
                          hide-details
                        ></v-checkbox>
                      </v-col>

                      <v-slide-x-transition>
                        <v-col v-if="!user.emailVerified">
                          <v-btn>Send Verification Email</v-btn>
                        </v-col>
                      </v-slide-x-transition>
                    </v-row>
                  </v-col>
                </v-row>
              </v-form-validated>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="reset">Reset</v-btn>
              <v-btn>Save Changes</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-expansion-panels v-model="panel" multiple>
            <v-expansion-panel>
              <v-expansion-panel-header>Actions</v-expansion-panel-header>

              <v-expansion-panel-content>
                <div class="my-2">
                  <div class="title">Reset User Password</div>
                  <div class="subtitle mb-2">
                    Sends the user an email prompting them to reset their
                    password.
                  </div>
                  <v-btn class="mb-2">
                    <v-icon left>mdi-email</v-icon>
                    Send Reset Password Email
                  </v-btn>
                </div>

                <v-divider class="my-5"></v-divider>

                <div class="my-2">
                  <div class="title">Lock User</div>
                  <div class="subtitle mb-2">
                    Prevents the user from signing in on the platform.
                  </div>
                  <v-btn class="mb-2" @click="user.locked = !user.locked">
                    <v-icon left>{{
                      user.locked ? 'mdi-lock-open' : 'mdi-lock'
                    }}</v-icon>

                    {{ user.locked ? 'Unlock User' : 'Lock User' }}
                  </v-btn>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>Metadata</v-expansion-panel-header>

              <v-expansion-panel-content>
                <div class="my-2">
                  <span class="font-weight-bold">Created On</span>
                  <span>{{ formatDate(user.createdAt, 'MMM d, yyyy') }}</span>
                </div>

                <div class="my-2">
                  <span class="font-weight-bold">Updated At</span>
                  <span>{{
                    formatDate(user.updatedAt, 'MMM d, yyyy h:mm a')
                  }}</span>
                </div>

                <div class="my-2">
                  <span class="font-weight-bold">Raw Data</span>
                  <codeblock :code="user"></codeblock>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { format } from 'date-fns'
import { User } from '~/../backend/src/user/user.entity'

@Component({
  layout: 'admin',
  head: {
    title: 'Edit User',
  },
})
export default class UserPage extends Vue {
  panel = [0]

  breadcrumbs = [
    {
      text: 'Dashboard',
      href: '/admin/',
    },
    {
      text: 'Users',
      href: '/admin/users',
    },
    {
      text: 'Edit User',
    },
  ]

  get user() {
    return this.$accessor.users.user as User
  }

  set user(value: User) {
    this.$accessor.users.setUser(value)
  }

  async fetch() {
    await this.$accessor.users.getUser(this.$route.params.id)
  }

  formatDate(date: string, formatString: string) {
    return format(new Date(date), formatString)
  }

  async reset() {
    await this.$accessor.users.getUser(this.$route.params.id)
  }
}
</script>
