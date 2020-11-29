<template>
  <v-container class="pa-6">
    <template v-if="!user">
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
                  <v-col cols="12" sm="auto">
                    <div class="d-flex flex-column">
                      <v-col class="d-flex justify-center">
                        <v-avatar size="100px">
                          <v-img :src="$avatar(user)" />
                        </v-avatar>
                      </v-col>

                      <dialog-select-avatar
                        v-slot="{ on, attrs }"
                        :upload="true"
                        :user="user"
                        @update:avatar="onUpdateAvatar"
                      >
                        <v-btn class="mt-1" text v-bind="attrs" v-on="on">
                          Edit Avatar
                        </v-btn>
                      </dialog-select-avatar>
                    </div>
                  </v-col>

                  <v-col>
                    <v-row>
                      <v-col cols="6">
                        <v-text-field-validated
                          v-model="user.first"
                          label="First Name"
                          rules="required"
                          hide-details="auto"
                          outlined
                          required
                        ></v-text-field-validated>
                      </v-col>

                      <v-col cols="6">
                        <v-text-field-validated
                          v-model="user.last"
                          label="Last Name"
                          rules="required"
                          hide-details="auto"
                          outlined
                          required
                        ></v-text-field-validated>
                      </v-col>

                      <v-col cols="12" lg="6">
                        <v-text-field-validated
                          v-model="user.email"
                          name="Email"
                          label="Email (Optional)"
                          hide-details="auto"
                          rules="email"
                          outlined
                        ></v-text-field-validated>
                      </v-col>

                      <v-col cols="12" lg="6">
                        <v-text-field-validated
                          v-model="user.omcEmail"
                          name="OMC Email"
                          label="OMC Email (Optional)"
                          hide-details="auto"
                          rules="email"
                          outlined
                        ></v-text-field-validated>
                      </v-col>

                      <v-col cols="12">
                        <birthday-picker v-model="user.dob" outlined />
                      </v-col>

                      <v-col col="12" xl="4">
                        <v-select-validated
                          v-model="user.gender"
                          :items="genders"
                          label="Gender"
                          rules="required"
                          outlined
                          hide-details="auto"
                        />
                      </v-col>

                      <v-col col="12" xl="4">
                        <v-select-validated
                          v-model="user.grade"
                          :items="grades"
                          label="Grade"
                          rules="required"
                          hide-details="auto"
                          outlined
                        />
                      </v-col>

                      <v-col col="12" xl="4">
                        <v-select-validated
                          v-model="user.roles"
                          :items="roles"
                          label="Roles"
                          hide-details="auto"
                          multiple
                          outlined
                        />
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
              <v-slide-x-transition>
                <v-btn
                  v-show="Object.keys(changes).length"
                  text
                  @click="onReset"
                >
                  Reset
                </v-btn>
              </v-slide-x-transition>

              <v-btn
                :disabled="!Object.keys(changes).length"
                :loading="$accessor.users.isLoading"
                color="primary"
                @click="onSubmit"
              >
                Save Changes
              </v-btn>
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
                  <v-btn class="mb-2" color="primary">
                    <v-icon left>mdi-email</v-icon>
                    Send Reset Password Email
                  </v-btn>
                </div>

                <v-divider class="my-5"></v-divider>

                <div class="my-2">
                  <div class="title">Change Password</div>
                  <div class="subtitle mb-2">
                    Changes the user's password. A notification is not sent, and
                    this cannot be undone.
                  </div>

                  <div class="mb-3">
                    <v-text-field-validated
                      v-model="password"
                      class="my-2"
                      label="Change Password (Optional)"
                      outlined
                      hide-details="auto"
                      clearable
                      @click:append="showPassword = !showPassword"
                    />
                  </div>

                  <v-btn
                    :disabled="!password || password.length === 0"
                    :loading="$accessor.users.isLoading"
                    color="primary"
                    @click="changePassword"
                    >Change Password
                  </v-btn>
                </div>

                <v-divider class="my-5"></v-divider>

                <div class="my-2">
                  <div class="title">Lock User</div>
                  <div class="subtitle mb-2">
                    Prevents the user from signing in on the platform.
                  </div>
                  <v-btn class="mb-2" color="primary" @click="toggleLocked">
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
                  <span>{{
                    formatDate(user.createdAt, 'MMM d, yyyy h:mm a')
                  }}</span>
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
import { DTOUser } from '../../../store/users'
import { UpdateUserDto } from '../../../../backend/src/user/dtos/update-user.dto'
import { shallowDiff } from '../../../utils/utilities'
import { grades } from '../../../utils/events'
import { genders, roles } from '../../../utils/constants'

@Component({
  layout: 'admin',
  head: {
    title: 'Edit User',
  },
  async asyncData({ app: { $accessor }, route }) {
    await $accessor.users.getUser(route.params.id)

    return {
      user: { ...$accessor.users.user },
    }
  },
})
export default class UserPage extends Vue {
  user: DTOUser | null = null
  showPassword = false
  password = ''
  grades = grades
  genders = genders
  roles = roles
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

  formatDate(date: string, formatString: string) {
    return format(new Date(date), formatString)
  }

  toggleLocked() {
    if (!this.user) return

    this.user.locked = !this.user.locked

    this.onSubmit()
  }

  onUpdateAvatar() {
    this.onReset()

    if (+this.$route.params.id === this.$accessor.auth.user?.id) {
      this.$accessor.auth.getMe()
    }
  }

  get changes(): UpdateUserDto {
    const old = this.$accessor.users.user!
    const user = this.user!

    const dto: UpdateUserDto = {
      first: user.first,
      last: user.last,
      avatar: user.avatar,
      dob: user.dob,
      grade: user.grade,
      email: user.email,
      omcEmail: user.omcEmail,
      emailVerified: user.emailVerified,
      locked: user.locked,
      password: user.password,
      roles: user.roles,
      gender: user.gender,
    }

    // Obtain the differences from the old user and the dto.
    const diff: any = shallowDiff(old, dto)

    return diff
  }

  async changePassword() {
    await this.$accessor.users.update({
      id: this.user!.id,
      updateUserDto: { password: this.password },
    })

    this.$accessor.snackbar.show({
      text: 'User password changed',
      timeout: 2000,
    })
  }

  async onReset() {
    await this.$accessor.users.getUser(this.$route.params.id)

    this.user = { ...this.$accessor.users.user } as DTOUser
  }

  async onSubmit() {
    if (!Object.keys(this.changes).length) return

    await this.$accessor.users.update({
      id: this.user!.id,
      updateUserDto: this.changes,
    })

    if (this.$accessor.users.error) {
      console.error(this.$accessor.users.error)
    } else {
      await this.onReset()

      this.$accessor.snackbar.show({
        text: 'Changes successfully saved.',
        timeout: 2000,
      })
    }
  }
}
</script>
