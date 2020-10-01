<template>
  <v-dialog v-model="dialog" max-width="440">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on">Add Project</v-btn>
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

      <ValidationObserver v-slot="{ passes, passed }" ref="form">
        <v-form @submit.prevent="passes(onSubmit)">
          <v-card-text>
            <ValidationProvider v-slot="{ errors }" rules="required">
              <v-text-field
                v-model="dto.name"
                label="Name"
                required
                :error-messages="errors"
              />
            </ValidationProvider>
            <v-textarea v-model="dto.description" label="Description" />
            <v-text-field v-model="dto.picture" label="Picture"></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-btn text type="button" :disabled="!passed" :loading="loading"
              >Create</v-btn
            >
          </v-card-actions>
        </v-form>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { Project } from '~/../backend/src/project/project.entity'

export default Vue.extend({
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  async fetch() {
    await this.$store.dispatch('projects/findAll')
  },
  data() {
    return {
      dialog: false,
      project: null as number | null,
      dto: {
        name: null,
        description: null,
        picture: null,
      },
    }
  },
  computed: {
    projects(): Project[] {
      return this.$store.state.projects.projects
    },
    loading() {
      return this.$store.getters['projects/isLoading']
    },
  },
  methods: {
    async onSubmit() {
      await this.$store.dispatch('projects/create', this.dto)
    },
  },
})
</script>
