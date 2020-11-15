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

          <v-row>
            <v-col cols="12">
              <v-text-field-validated
                v-model="dto.name"
                label="Name"
                rules="required"
                required
                outlined
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="dto.description"
                label="Description"
                hide-details="auto"
                outlined
              />
            </v-col>

            <v-col cols="12">
              <file-upload
                v-model="files"
                label="Upload Image (Optional)"
                endpoint="/file"
                outlined
                chips
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text type="submit" :disabled="!passes" :loading="isLoading">
            Create
          </v-btn>
        </v-card-actions>
      </v-form-validated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { File } from '@backend/file/file.entity'
import { CreateProjectDto } from '~/../backend/src/project/dto/create-project.dto'
import { Nullable } from '~/interfaces/nullable.type'
import { Uploads } from '~/interfaces/uploads.interface'

@Component
export default class DialogCreateProject extends Vue {
  dialog = false
  project: number | null = null
  dto: Nullable<CreateProjectDto> = {
    name: null,
    description: null,
    picture: null,
  }

  files: Uploads = null

  get projects() {
    return this.$accessor.projects.projects
  }

  get error() {
    return this.$accessor.projects.error
  }

  get isLoading() {
    return this.$accessor.files.isLoading || this.$accessor.projects.isLoading
  }

  async onSubmit() {
    let file: File | null = null

    if (this.files && !(Array.isArray(this.files) && this.files.length === 0)) {
      file = await this.$accessor.files.uploadFile(this.files)
    }

    if (this.$accessor.files.error) {
      console.error(this.$accessor.files.error)
    }

    const project = await this.$accessor.projects.create(
      Object.assign(
        {
          ...(this.dto as CreateProjectDto),
        },
        file && { picture: file.root }
      )
    )

    if (!this.error) {
      this.$emit('create:project', project)
      this.dialog = false
    }
  }
}
</script>
