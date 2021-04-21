<template>
  <VAutocompleteValidated
    :value="value"
    :items="$accessor.projects.projects"
    :loading="bouncing || $accessor.projects.isLoading"
    :search-input.sync="search"
    item-text="name"
    placeholder="Search for a project"
    hide-details="auto"
    clearable
    outlined
    v-bind="$attrs"
    @input="$emit('input', $event || null)"
  ></VAutocompleteValidated>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { throttle } from 'lodash'

@Component
export default class AutoCompleteProject extends Vue {
  @Prop() value!: any
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
    await this.$accessor.projects.findAll()
    this.bouncing = false
  }
}
</script>
