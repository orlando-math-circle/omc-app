<template>
  <v-autocomplete
    :value="value"
    :items="$store.state.courses.courses"
    :loading="isLoading"
    :search-input.sync="search"
    label="Course"
    item-text="name"
    item-value="id"
    placeholder="Search for a course"
    hide-details="auto"
    clearable
  />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { throttle } from 'lodash'

@Component
export default class AutoCompleteCourse extends Vue {
  @Prop() value!: number | null
  @Prop() project!: number

  search = ''
  bouncing = false

  get isLoading() {
    return this.bouncing || this.$accessor.courses.isLoading
  }

  findAllThrottled = throttle(async () => await this.findAll(), 2500)

  @Watch('search')
  async onSearch() {
    this.bouncing = true
    await this.findAllThrottled()
  }

  async findAll() {
    await this.$accessor.courses.findAllByCourse({ project: this.project })
    this.bouncing = false
  }
}
</script>
