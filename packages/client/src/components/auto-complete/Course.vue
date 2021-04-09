<template>
  <v-autocomplete
    :value="value"
    :items="$accessor.courses.courses"
    :loading="bouncing || $accessor.courses.isLoading"
    :search-input.sync="search"
    label="Course"
    item-text="name"
    placeholder="Search for a course"
    hide-details="auto"
    clearable
    outlined
    v-bind="$attrs"
    @input="$emit('input', $event || null)"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { throttle } from 'lodash'

@Component
export default class AutoCompleteCourse extends Vue {
  @Prop() value!: any
  @Prop() project!: number
  @Prop({ default: 250 }) wait!: number

  search = ''
  bouncing = false
  findAllThrottled = throttle(async () => await this.findAll(), this.wait)

  @Watch('search')
  async onSearch() {
    this.bouncing = true
    await this.findAllThrottled()
  }

  async findAll() {
    await this.$accessor.courses.findAllByProject({ project: this.project })
    this.bouncing = false
  }
}
</script>
