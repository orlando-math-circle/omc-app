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

      <ValidationObserver v-slot="{ passes, passed }" ref="form">
        <v-form @submit.prevent="passes(onSubmit)">
          <v-card-text>
            <alert-error v-if="error" :error="error" />

            <ValidationProvider v-slot="{ errors }" rules="required">
              <v-text-field
                v-model="dto.name"
                label="Name"
                required
                :error-messages="errors"
                outlined
              />
            </ValidationProvider>
            <v-textarea
              v-model="dto.description"
              label="Description"
              outlined
            />
            <v-text-field v-model="dto.picture" label="Picture" outlined />
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              type="submit"
              :disabled="!passed"
              :loading="$store.getters['projects/isLoading']"
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
    error(): Error {
      return this.$store.state.projects.error
    },
  },
  methods: {
    async onSubmit() {
      const project = await this.$store.dispatch('projects/create', this.dto)

      if (!this.error) {
        this.$emit('create:project', project)
        this.dialog = false
      }
    },
  },
})
</script>
