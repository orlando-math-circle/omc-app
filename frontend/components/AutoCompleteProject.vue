<template>
  <v-autocomplete
    :value="value"
    :items="$accessor.projects.projects"
    :loading="isLoading"
    :search-input.sync="search"
    label="Project"
    item-text="name"
    item-value="id"
    placeholder="Search for a project"
    hide-details="auto"
    clearable
    @change="onChange"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { throttle } from 'lodash'

@Component
export default class AutoCompleteProject extends Vue {
  @Prop() value!: number | null

  search = ''
  bouncing = false

  get isLoading() {
    return this.bouncing || this.$accessor.projects.isLoading
  }

  findAllThrottled = throttle(async () => await this.findAll(), 250)

  @Watch('search')
  async onSearch() {
    this.bouncing = true
    await this.findAllThrottled()
  }

  onChange(id: number) {
    this.$emit('input', id)
  }

  async findAll() {
    await this.$accessor.projects.findAll()
    this.bouncing = false
  }
}
</script>
