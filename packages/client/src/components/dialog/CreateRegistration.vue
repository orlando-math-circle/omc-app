<template>
  <DialogForm ref="refDialog" @form:submit="onSubmit">
    <template #title>Create Registration</template>
    <template #subtitle>
      Registers a user to an event. This will bypass payment requirements.
    </template>

    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }"></slot>
    </template>

    <v-card-text>
      <v-list dense>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon>mdi-account-circle-outline</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <auto-complete-user v-model="user" />
          </v-list-item-content>
        </v-list-item>

        <v-divider />
      </v-list>
    </v-card-text>
  </DialogForm>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive } from '@nuxtjs/composition-api'
import { User } from '@server/user/user.entity'

export default defineComponent({
  setup() {
    const state = reactive({
      user: null as User | null,
    })

    // TODO: NYI
    const onSubmit = () => {}

    return { ...toRefs(state), onSubmit }
  },
})
</script>
