<template>
  <v-dialog v-model="dialog">
    <!-- Slot: Activator -->
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn v-bind="attrs" large text v-on="on">Search</v-btn>
      </slot>
    </template>

    <v-card :loading="isLoading">
      <v-toolbar flat>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title>Custom recurrence</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-toolbar>

      <v-card-text>
        <v-text-field
          v-model="search"
          label="Search courses"
          outlined
          autocomplete="off"
          hide-details="auto"
        ></v-text-field>

        <v-expand-transition>
          <v-data-table
            :items="$store.state.courses.courses"
            :headers="headers"
            :search="search"
            :server-items-length="$store.state.courses.total"
            show-select
            single-select
            @item-selected="onTableSelected"
            @update:options="onOptionsChange"
          ></v-data-table>
        </v-expand-transition>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
import { throttle } from 'lodash'
import { DataTableOptions } from '../../interfaces/data-table.interface'

@Component
export default class DialogSelectCourse extends Vue {
  @Prop() value!: number | null
  @Prop() project!: number

  dialog = false
  search = ''
  bouncing = false

  headers = [
    { text: 'Name', value: 'name' },
    { text: 'Description', value: 'description' },
    { text: 'Payment Type', value: 'paymentType' },
  ]

  pagination = {
    total: 0,
    limit: 10,
    offset: 10,
    sort: [] as string[],
  }

  get id() {
    return this.value
  }

  set id(value: number | null) {
    this.$emit('input', value)
  }

  get courses() {
    return this.$accessor.courses.courses
  }

  get isLoading() {
    return this.$accessor.courses.isLoading
  }

  @Watch('search')
  onSearch() {
    this.bouncing = true
    this.$fetch()
  }

  async fetch() {
    await this.$accessor.courses.findAllByCourse({
      project: this.project,
      findallCoursesDto: {
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      },
    })
  }

  findAllThrottled = throttle(() => this.findAll())

  findAll() {
    const all = this.pagination.limit === -1

    this.$accessor.courses.findAll({
      contains: this.search,
      limit: all ? undefined : this.pagination.limit,
      offset: all ? undefined : this.pagination.offset,
      sort: this.pagination.sort.length ? this.pagination.sort : undefined,
    })
    this.bouncing = false
  }

  onTableSelected(value: any) {
    this.id = value.item.id
  }

  onOptionsChange(options: DataTableOptions) {
    this.pagination.limit = options.itemsPerPage
    this.pagination.offset = this.pagination.limit * (options.page - 1)

    if (options.sortBy.length) {
      this.pagination.sort = []

      for (let i = 0; i < options.sortBy.length; i++) {
        this.pagination.sort[i] = `${options.sortBy[i]}:${
          options.sortDesc[i] ? 'DESC' : 'ASC'
        }`
      }
    }

    this.$fetch()
  }
}
</script>
