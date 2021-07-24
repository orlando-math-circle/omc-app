<template>
  <div>
    <div v-if="!user.roles.includes('volunteer')">
      <h1 class="text-center mb-10">Register to Volunteer!</h1>
      <p>Please read the following forms carefully before digitally signing.</p>

      <!-- v-if="!user.roles.volunteer" -->
      <VFormValidated
        ref="volunteerRegistrationForm"
        @form:submit="onVolunteerRegistration(user)"
      >
        <v-row class="mb-10">
          <h3 class="mb-5">Photo Release and Liability Waiver</h3>
          <object
            data="http://localhost:3000/defaults/OMC_Photo_release_and_Liability_WaiverOnline_Policy.pdf"
            type="application/pdf"
            width="100%"
            height="480"
          />

          <v-list width="100%">
            <v-list-item>
              <VCheckboxValidated
                v-model="checkbox"
                rules="required"
                required
              />

              <v-list-item-content>
                <label class="pl-5"
                  >I agree to the terms and conditions inside the Photo Release
                  and Liability Waiver</label
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-row>

        <v-row class="mb-10">
          <h3 class="mb-5">Code of Conduct</h3>
          <object
            data="http://localhost:3000/defaults/Volunteers_-_Code_of_Conduct.pdf"
            type="application/pdf"
            width="100%"
            height="480"
          />
          <v-list width="100%">
            <v-list-item>
              <VCheckboxValidated
                v-model="checkbox1"
                rules="required"
                required
              />

              <v-list-item-content>
                <label class="pl-5"
                  >I agree to the terms and conditions inside the Code of
                  Conduct</label
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-row>

        <v-row class="mb-10">
          <h3 class="mb-5">Volunteer SOP</h3>
          <object
            data="http://localhost:3000/defaults/OMC_IC_Volunteer_SOP.pdf"
            type="application/pdf"
            width="100%"
            height="480"
          />
          <v-list width="100%">
            <v-list-item>
              <VCheckboxValidated
                v-model="checkbox2"
                rules="required"
                required
              />

              <v-list-item-content>
                <label class="pl-5"
                  >I agree to the terms and conditions inside the Volunteer
                  SOP</label
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-row>
        <v-btn type="submit" color="primary"> Register as Volunteer </v-btn>
      </VFormValidated>
    </div>
    <div v-else>
      <h1>Volunteer Dashboard</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from '@nuxtjs/composition-api'
import { useAuth, UserEntity, useUsers } from '@/stores'
import { Roles } from '@server/app.roles'
import { useSnackbar, useStateReset } from '@/composables'

export default defineComponent({
  setup() {
    const authStore = useAuth()
    const userStore = useUsers()
    const snackbar = useSnackbar()

    const { state, reset } = useStateReset({
      checkbox: false,
      checkbox1: false,
      checkbox2: false,
    })

    const onVolunteerRegistration = async (user: UserEntity) => {
      if (!user.roles.includes(Roles.VOLUNTEER)) {
        await userStore.update(user.id, { volunteer: true }, true)
        if (userStore.error) {
          snackbar.error(userStore.error.message)
        }
        snackbar.success('You have registered as a volunteer!')
        document.location.reload()
      } else snackbar.error('You are already registered as a volunteer!')
    }

    return {
      isVerified: computed(() => authStore.isVerified),
      user: computed(() => authStore.user!),
      onVolunteerRegistration,
      useSnackbar,
      ...toRefs(state),
      reset,
    }
  },

  async asyncData({ pinia }) {
    await Promise.all([useAuth(pinia).getMyAccount()])
  },

  head: {
    title: 'Volunteer',
  },
})
</script>
