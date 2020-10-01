<template>
  <v-dialog v-model="dialog">
    <!-- Slot: Activator -->
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-select :items="courses"></v-select>
      </slot>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title>Custom recurrence</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn text>Create</v-btn>
      </v-toolbar>

      <v-card-text> </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Course } from '~/../backend/src/course/course.entity'

export default Vue.extend({
  async fetch() {
    await this.$store.dispatch('courses/getCourses')
  },
  data() {
    return {
      dialog: true,
    }
  },
  computed: {
    courses(): Course[] {
      return this.$store.state.courses.courses
    },
  },
})
</script>
