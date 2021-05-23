<template>
  <div>
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
              <Breadcrumbs class="pa-0" :items="breadcrumbs" large />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card>
            <v-card-title>Basic Information</v-card-title>

            <VFormValidated @form:submit="onSubmit">
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="auto">
                    <div class="d-flex flex-column">
                      <v-col class="d-flex justify-center">
                        <v-avatar size="100px">
                          <v-img :src="user.avatarUrl" />
                        </v-avatar>
                      </v-col>

                      <DialogSelectAvatar
                        v-slot="{ on, attrs }"
                        :user="user"
                        custom
                        @update:avatar="onUpdateAvatar"
                      >
                        <v-btn class="mt-1" text v-bind="attrs" v-on="on">
                          Edit Avatar
                        </v-btn>
                      </DialogSelectAvatar>
                    </div>
                  </v-col>

                  <v-col>
                    <v-row>
                      <v-col cols="6">
                        <VTextFieldValidated
                          v-model="user.first"
                          label="First Name"
                          rules="required"
                          hide-details="auto"
                          outlined
                          required
                        />
                      </v-col>

                      <v-col cols="6">
                        <VTextFieldValidated
                          v-model="user.last"
                          label="Last Name"
                          rules="required"
                          hide-details="auto"
                          outlined
                          required
                        />
                      </v-col>

                      <v-col cols="12" lg="6">
                        <VTextFieldValidated
                          v-model="user.email"
                          name="Email"
                          label="Email (Optional)"
                          hide-details="auto"
                          rules="email"
                          outlined
                        />
                      </v-col>

                      <v-col cols="12" lg="6">
                        <VTextFieldValidated
                          v-model="user.omcEmail"
                          name="OMC Email"
                          label="OMC Email (Optional)"
                          hide-details="auto"
                          rules="email"
                          outlined
                        />
                      </v-col>

                      <v-col cols="12">
                        <BirthdayPicker v-model="user.dob" outlined />
                      </v-col>

                      <v-col cols="12" xl="4">
                        <VSelectValidated
                          v-model="user.gender"
                          :items="genders"
                          label="Gender"
                          rules="required"
                          outlined
                          hide-details="auto"
                        />
                      </v-col>

                      <v-col cols="12" xl="4">
                        <VSelectValidated
                          v-model="user.grade"
                          :items="grades"
                          label="Grade"
                          hide-details="auto"
                          outlined
                        />
                      </v-col>

                      <v-col cols="12" xl="4">
                        <VSelectValidated
                          v-model="user.roles"
                          :items="roles"
                          label="Roles"
                          hide-details="auto"
                          multiple
                          outlined
                        />
                      </v-col>

                      <v-col v-if="user.industry" cols="12" xl="4">
                        <VTextFieldValidated
                          v-model="user.industry.profession"
                          label="Profession (Optional)"
                          hide-details="auto"
                          outlined
                        />
                      </v-col>

                      <v-col v-if="user.industry" cols="12" xl="4">
                        <VTextFieldValidated
                          v-model="user.industry.jobTitle"
                          label="Job Title (Optional)"
                          hide-details="auto"
                          outlined
                        />
                      </v-col>

                      <v-col v-if="user.industry" cols="12" xl="4">
                        <VTextFieldValidated
                          v-model="user.industry.company"
                          label="Company or Workplace (Optional)"
                          hide-details="auto"
                          outlined
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-spacer />

                <v-slide-x-transition>
                  <v-btn
                    v-show="Object.keys(changes).length"
                    text
                    @click="reset"
                    >Reset</v-btn
                  >
                </v-slide-x-transition>

                <v-btn
                  :disabled="!Object.keys(changes).length"
                  :loading="isLoading"
                  type="submit"
                >
                  Save Changes
                </v-btn>
              </v-card-actions>
            </VFormValidated>
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
                  <div class="title">Verify User Email</div>
                  <div class="subtitle mb-2">
                    Bypasses normal verification requirements for a user.
                  </div>

                  <v-checkbox
                    v-model="user.emailVerified"
                    class="ma-0"
                    label="Email Verified"
                    hide-details
                    @change="onVerify"
                  ></v-checkbox>
                </div>

                <div v-if="account && account.id" class="my-2">
                  <div class="title">Reset Account Password</div>
                  <div class="subtitle mb-2">
                    Sends the primary user on their account an email prompting
                    them to reset their password.
                  </div>
                  <v-btn class="mb-2" color="primary" @click="resetEmail">
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
                    <VTextFieldValidated
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
                    :loading="isLoading"
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
  </div>
</template>

<script lang="ts">
import { format } from 'date-fns'
import { cloneDeep } from 'lodash'
import { UpdateUserDto } from '@server/user/dtos/update-user.dto'
import { shallowDiff } from '@/utils/utilities'
import { grades } from '@/utils/events'
import { genders, roles } from '@/utils/constants'
import {
  computed,
  defineComponent,
  reactive,
  useRoute,
  toRefs,
  useFetch,
} from '@nuxtjs/composition-api'
import { UserEntity, AccountEntity, useAuth, useUsers } from '@/stores'
import { useSnackbar } from '@/composables'

export default defineComponent({
  layout: 'admin',
  setup() {
    const state = reactive({
      user: null as UserEntity | null,
      account: null as AccountEntity | null,
      showPassword: false,
      password: '',
      lock: false,
      panel: [0],
    })

    const route = useRoute()
    const authStore = useAuth()
    const userStore = useUsers()
    const snackbar = useSnackbar()
    // const dateUtil = useDates()

    const breadcrumbs = [
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

    const isLoading = computed(() => userStore.isLoading)

    const formatDate = (date: string, formatString: string) => {
      return format(new Date(date), formatString)
    }

    const toggleLocked = async () => {
      if (!state.user) return

      await userStore.update(+route.value.params.id, {
        locked: !state.user.locked,
      })

      if (userStore.error) {
        snackbar.error('Unable to save changes')
      } else {
        snackbar.success('Changes Saved')
      }

      await reset()
    }

    const onUpdateAvatar = () => {
      reset()

      if (+route.value.params.id === authStore.user?.id) {
        authStore.getMyUser()
      }
    }

    const changes = computed<UpdateUserDto>(() => {
      if (state.lock) return {}

      const storeUser = { ...userStore.user }

      // Accomodate for possibly null industry property
      storeUser.industry = storeUser.industry || {
        profession: '',
        jobTitle: '',
        company: '',
      }

      return shallowDiff(storeUser, {
        first: state.user!.first,
        last: state.user!.last,
        avatar: state.user!.avatar,
        dob: state.user!.dob,
        grade: state.user!.grade,
        email: state.user!.email,
        omcEmail: state.user!.omcEmail,
        emailVerified: state.user!.emailVerified,
        locked: state.user!.locked,
        password: state.user!.password,
        roles: state.user!.roles,
        gender: state.user!.gender,
        industry: state.user!.industry,
      })
    })

    const resetEmail = async () => {
      if (!state.user?.email) return

      await authStore.forgotPassword(state.user.email)

      snackbar.show('Email Sent')
    }

    const changePassword = async () => {
      await userStore.update(state.user!.id, { password: state.password })

      snackbar.success('User password changed')
    }

    const onVerify = async (value: boolean) => {
      await userStore.update(state.user!.id, { emailVerified: value })

      if (userStore.error) {
        return snackbar.error(userStore.error.message)
      }

      snackbar.success(`User ${value ? 'Verified' : 'Unverified'}`)
    }

    const reset = async () => {
      state.lock = true

      await userStore.findOne(+route.value.params.id)

      state.user = cloneDeep(userStore.user!)

      if (!state.user.industry) {
        state.user.industry = {
          profession: '',
          jobTitle: '',
          company: '',
        }
      }

      state.lock = false
    }

    const onSubmit = async (shouldReset = true) => {
      if (!Object.keys(changes.value).length) return

      await userStore.update(state.user!.id, changes.value)

      if (userStore.error) {
        snackbar.error(userStore.error.message)
      } else {
        if (shouldReset) {
          await reset()
        }

        snackbar.success('Changes successfully saved.')
      }
    }

    useFetch(async () => {
      await Promise.all([
        userStore.findOne(+route.value.params.id),
        authStore.findAccountByUser(+route.value.params.id),
      ])

      if (userStore.error || authStore.error) {
        throw new Error(
          userStore.error?.message ||
            authStore.error?.message ||
            'Unable to retrieve user information'
        )
      }

      state.user = cloneDeep(userStore.user!)
      state.account = cloneDeep(authStore.account)

      state.user.industry = state.user.industry || {
        profession: '',
        jobTitle: '',
        company: '',
      }
    })

    return {
      ...toRefs(state),
      grades,
      roles,
      genders,
      changes,
      breadcrumbs,
      isLoading,
      formatDate,
      toggleLocked,
      onUpdateAvatar,
      onVerify,
      onSubmit,
      reset,
      resetEmail,
      changePassword,
    }
  },
  head: {
    title: 'Edit User',
  },
})
</script>
