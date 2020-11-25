<template>
  <v-dialog v-model="dialog" max-width="440">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn v-bind="attrs" large icon v-on="on">
          <v-icon>mdi-folder-plus-outline</v-icon>
        </v-btn>
      </slot>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title>Create Course</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-toolbar>

      <v-form-validated v-slot="{ passes }" @submit:form="onSubmit">
        <v-card-text>
          <alert-error v-if="error" :error="error" />

          <v-text-field-validated
            v-model="dto.name"
            label="Course Name"
            rules="required"
            required
            outlined
          ></v-text-field-validated>

          <v-textarea-validated
            v-model="dto.description"
            label="Course Description"
            outlined
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            text
            type="submit"
            :disabled="!passes"
            :loading="$accessor.courses.isLoading"
            >Create</v-btn
          >
        </v-card-actions>
      </v-form-validated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class DialogCreateCourse extends Vue {
  @Prop() project!: number

  dialog = false

  dto = {
    name: '',
    description: '',
  }

  get error() {
    return this.$accessor.courses.error
  }

  async onSubmit() {
    const dto = {
      name: this.dto.name,
      description: this.dto.description,
      project: this.project,
    }

    const course = await this.$accessor.courses.create(dto)

    if (!this.error) {
      this.$emit('create:course', course)
      this.dialog = false
    }
  }
}
</script>
