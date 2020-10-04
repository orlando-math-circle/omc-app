<template>
  <v-autocomplete
    v-model="id"
    :items="$store.state.projects.projects"
    :loading="loading"
    :search-input.sync="search"
    label="Project"
    item-text="name"
    item-value="id"
    placeholder="Search for a project"
    hide-details="auto"
    cache-items
    clearable
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { throttle } from 'lodash'
import { FindAllProjectsDto } from '../../backend/src/project/dto/find-all-projects.dto'

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
      return this.bouncing || this.$store.getters['projects/isLoading']
    },
  },
  watch: {
    async search() {
      this.bouncing = true
      await this.findAll({ contains: this.search, limit: 20 })
    },
  },
  methods: {
    findAll: throttle<(dto: FindAllProjectsDto) => void>(async function (
      this: any,
      dto: FindAllProjectsDto
    ) {
      await this.$store.dispatch('projects/findAll', dto)
      this.bouncing = false
    },
    250),
  },
})
</script>
