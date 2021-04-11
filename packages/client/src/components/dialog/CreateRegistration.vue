<template>
  <dialog-form ref="refDialog" @submit:form="onSubmit">
    <template #title>Create Registration</template>
    <template #subtitle
      >Registers a user to an event. This will bypass payment
      requirements.</template
    >

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
  </dialog-form>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { User } from '@server/user/user.entity'

@Component
export default class DialogCreateRegistration extends Vue {
  user: User | null = null

  onSubmit() {}
}
</script>
