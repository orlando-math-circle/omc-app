<template>
  <v-dialog v-model="dialog">
    <!-- Slot: Activator -->
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn v-bind="attrs" large text v-on="on">Search</v-btn>
      </slot>
    </template>

    <v-card :loading="loading">
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
import Vue from 'vue'
import { throttle } from 'lodash'
import { FindAllCoursesDto } from '../../backend/src/course/dto/find-all-courses.dto'
import { DataTableOptions } from '../interfaces/data-table.interface'
import { Course } from '~/../backend/src/course/course.entity'

export default Vue.extend({
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  async fetch() {
    await this.$store.dispatch('courses/findAll', {
      limit: this.pagination.limit,
      offset: this.pagination.offset,
    })
  },
  data() {
    return {
      dialog: false,
      search: '',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Payment Type', value: 'paymentType' },
      ],
      bouncing: false,
      pagination: {
        total: 0,
        limit: 10,
        offset: 10,
        sort: [] as string[],
      },
    }
  },
  computed: {
    courses(): Course[] {
      return this.$store.state.courses.courses
    },
    id: {
      get(): number {
        return this.value
      },
      set(id: number) {
        this.$emit('input', id)
      },
    },
    loading(): boolean {
      return this.bouncing || this.$store.getters['projects/isLoading']
    },
  },
  watch: {
    search(): void {
      this.bouncing = true
      this.refresh()
    },
  },
  methods: {
    findAll: throttle<(dto: FindAllCoursesDto) => void>(function (
      this: any,
      dto: FindAllCoursesDto
    ) {
      this.$store.dispatch('courses/findAll', dto)
      this.bouncing = false
    },
    250),
    onTableSelected(value: any) {
      this.id = value.item.id
    },
    async refresh() {
      const all = this.pagination.limit === -1

      await this.findAll({
        contains: this.search,
        limit: all ? undefined : this.pagination.limit,
        offset: all ? undefined : this.pagination.offset,
        sort: this.pagination.sort.length ? this.pagination.sort : undefined,
      })
    },
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

      this.refresh()
    },
  },
})
</script>
