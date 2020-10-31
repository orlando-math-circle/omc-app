<template>
  <v-dialog v-model="dialog" max-width="440">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn v-bind="attrs" large text v-on="on">Create</v-btn>
      </slot>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title>Create Project</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-toolbar>

      <v-form-validated v-slot="{ passes }" @submit:form="onSubmit">
        <v-card-text>
          <alert-error v-if="error" :error="error" />

          <v-text-field-validated
            v-model="dto.name"
            label="Name"
            rules="required"
            required
            outlined
          />
          <v-textarea v-model="dto.description" label="Description" outlined />
          <v-text-field v-model="dto.picture" label="Picture" outlined />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            type="submit"
            :disabled="!passes"
            :loading="$store.getters['projects/isLoading']"
            >Create</v-btn
          >
        </v-card-actions>
      </v-form-validated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { CreateProjectDto } from '~/../backend/src/project/dto/create-project.dto'
import { Nullable } from '~/interfaces/nullable.type'

@Component
export default class DialogCreateProject extends Vue {
  dialog = false
  project: number | null = null
  dto: Nullable<CreateProjectDto> = {
    name: null,
    description: null,
    picture: null,
  }

  get projects() {
    return this.$accessor.projects.projects
  }

  get error() {
    return this.$accessor.projects.error
  }

  async onSubmit() {
    const project = await this.$accessor.projects.create(
      this.dto as CreateProjectDto
    )

    if (!this.error) {
      this.$emit('create:project', project)
      this.dialog = false
    }
  }
}
</script>
