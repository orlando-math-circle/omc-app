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

          <v-row>
            <v-col v-if="!project" cols="12">
              <auto-complete-project
                v-model="newProject"
                :rules="{ required: !project }"
                item-value="id"
                outlined
              ></auto-complete-project>
            </v-col>

            <v-col cols="12">
              <v-text-field-validated
                v-model="dto.name"
                label="Name"
                rules="required"
                hide-details="auto"
                required
                outlined
              ></v-text-field-validated>
            </v-col>

            <v-col cols="12">
              <v-textarea-validated
                v-model="dto.description"
                label="Description (Optional)"
                hide-details="auto"
                outlined
              />
            </v-col>
          </v-row>
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
  @Prop() readonly project?: number

  dialog = false
  newProject: number | null = null

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
      project: this.project ? this.project : this.newProject!,
    }

    const course = await this.$accessor.courses.create(dto)

    if (!this.error) {
      this.$emit('create:course', course)
      this.dialog = false
    }
  }
}
</script>
