<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mobile"
    max-width="440"
  >
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn v-bind="attrs" large text v-on="on">Edit</v-btn>
      </slot>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title>Update User</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-toolbar>

      <VFormValidated>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field-validated
                v-model="dto.first"
                label="First Name"
                rules="required"
                required
                outlined
              ></v-text-field-validated>
            </v-col>
            <v-col>
              <v-text-field-validated
                v-model="dto.last"
                label="Last Name"
                rules="required"
                required
                outlined
              ></v-text-field-validated>
            </v-col>
          </v-row>

          <birthday-picker v-model="dto.dob" outlined></birthday-picker>

          <v-row>
            <v-col>
              <v-text-field-validated
                v-model="dto.email"
                label="Email"
                rules="required"
                required
                outlined
              ></v-text-field-validated>

              <v-select-validated
                v-model="dto.gender"
                :items="genders"
                label="Gender"
                rules="required"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn type="submit" :disabled="!passes">Submit Changes</v-btn>
        </v-card-actions>
      </VFormValidated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api'
import { genders } from '../../utils/constants'

export default defineComponent({
  setup() {
    const state = reactive({
      dialog: false,
      dto: {
        first: '',
        last: '',
        email: '',
        dob: null as string | null,
        gender: null,
      },
    })

    const onSubmit = () => {
      //  TODO: NYI
      console.log('Submitting Form')
    }

    return {
      ...toRefs(state),
      genders,
      onSubmit,
    }
  },
})
</script>
