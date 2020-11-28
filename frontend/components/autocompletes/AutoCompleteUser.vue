<template>
  <v-autocomplete-validated
    :value="value"
    :items="$accessor.users.users"
    :loading="bouncing || $accessor.users.isLoading"
    :search-input.sync="search"
    no-filter
    label="User"
    item-text="name"
    return-object
    placeholder="Search for a user..."
    hide-details="auto"
    clearable
    outlined
    v-bind="$attrs"
    @input="$emit('input', $event || null)"
  >
    <template #selection="data">
      <v-chip v-bind="data.attrs">
        <v-avatar left>
          <v-img :src="$avatar(data.item)" />
        </v-avatar>

        {{ data.item.name }}
      </v-chip>
    </template>

    <template #item="data">
      <v-list-item-avatar>
        <v-img :src="$avatar(data.item)" />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>{{ data.item.name }}</v-list-item-title>
        <v-list-item-subtitle>{{
          data.item.email || 'No email'
        }}</v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete-validated>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { throttle } from 'lodash'

@Component
export default class AutoCompleteUser extends Vue {
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
    await this.$accessor.users.findAll(
      this.search?.length ? { contains: this.search } : {}
    )
    this.bouncing = false
  }
}
</script>
