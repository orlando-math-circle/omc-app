<template>
  <v-autocomplete
    v-model="id"
    :items="$store.state.courses.courses"
    :loading="loading"
    :search-input.sync="search"
    label="Course"
    item-text="name"
    item-value="id"
    placeholder="Search for a course"
    hide-details="auto"
    cache-items
    clearable
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { throttle } from 'lodash'
import { FindAllCoursesDto } from '../../backend/src/course/dto/find-all-courses.dto'

export default Vue.extend({
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      search: '',
      bouncing: false,
    }
  },
  computed: {
    id: {
      get(): number {
        return this.value
      },
      set(id: number) {
        this.$emit('input', id || 0)
      },
    },
    loading(): boolean {
      return this.bouncing || this.$store.getters['courses/isLoading']
    },
  },
  watch: {
    async search() {
      this.bouncing = true
      await this.findAll({ contains: this.search, limit: 20 })
    },
  },
  methods: {
    findAll: throttle<(dto: FindAllCoursesDto) => void>(async function (
      this: any,
      dto: FindAllCoursesDto
    ) {
      await this.$store.dispatch('courses/findAll', dto)
      this.bouncing = false
    },
    250),
  },
})
</script>
