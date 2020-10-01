<template>
  <v-dialog v-model="dialog" max-width="650">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="project"
              :items="projects.auto"
              :search-input.sync="search"
              :loading="loading"
              item-text="name"
              item-value="id"
              placeholder="Search for a project"
              hide-details="auto"
            />
          </v-col>

          <v-col>
            <v-btn v-bind="attrs" text v-on="on"> Full Search </v-btn>
          </v-col>
        </v-row>
      </slot>
    </template>

    <v-card :loading="loading">
      <v-toolbar flat>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <v-toolbar-title>Select Project</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-text-field
          v-model="tableSearch"
          label="Search projects"
          outlined
          autocomplete="off"
          hide-details="auto"
        ></v-text-field>

        <v-expand-transition>
          <v-data-table
            :items="projects.table"
            :headers="headers"
            :search="tableSearch"
            :server-items-length="$store.state.projects.total"
            show-select
            single-select
            @item-selected="onSelected"
            @update:options="onTableOptionsChange"
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
import { DebouncedFunc, throttle } from 'lodash'
import { DataTableOptions } from '../interfaces/data-table.interface'
import { Project } from '~/../backend/src/project/project.entity'

export default Vue.extend({
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  async fetch() {
    const [projects, count] = await this.$store.dispatch('projects/findAll', {
      limit: this.pagination.limit,
      offset: this.pagination.offset,
    })

    this.pagination.total = count
    this.projects.table = [...projects]
    this.projects.auto = [...projects]
  },
  data() {
    return {
      dialog: false,
      autoQuery: '',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
      ],
      bounced: false,
      tableQuery: '',
      projects: {
        auto: [] as Project[],
        table: [] as Project[],
      },
      throttler: null as DebouncedFunc<any> | null,
      pagination: {
        total: 0,
        limit: 10,
        offset: 0,
        sort: [] as string[],
      },
    }
  },
  computed: {
    project: {
      get(): number {
        return this.value
      },
      set(value: number) {
        this.$emit('input', value)
      },
    },
    loading(): boolean {
      return this.bounced || this.$store.getters['projects/isLoading']
    },
    search: {
      get(): string {
        return this.autoQuery
      },
      async set(value: string) {
        if (value === this.autoQuery) return

        this.autoQuery = value
        await this.throttle(value)
        this.projects.auto = this.$store.state.projects.projects
      },
    },
    tableSearch: {
      get(): string {
        return this.tableQuery
      },
      async set(value: string) {
        if (value === this.tableQuery) return

        this.tableQuery = value
        await this.throttle(value)
        this.projects.table = this.$store.state.projects.projects
      },
    },
  },
  methods: {
    async throttle(search: string, limit?: number, offset?: number) {
      this.bounced = true

      if (!this.throttler) {
        this.throttler = throttle(this.query, 500)
      }

      await this.throttler(search, limit, offset)
    },
    async query(search: string, limit?: number, offset?: number) {
      await this.$store.dispatch('projects/findAll', { search, limit, offset })
      this.bounced = false
    },
    onSelected(value: any) {
      this.project = value.item.id
    },
    async onTableOptionsChange(options: DataTableOptions) {
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

      const all = this.pagination.limit === -1
      const sorted = options.sortBy.length

      await this.$store.dispatch('projects/findAll', {
        search: this.tableQuery,
        limit: all ? undefined : this.pagination.limit,
        offset: all ? undefined : this.pagination.offset,
        sort: sorted ? this.pagination.sort : undefined,
      })

      this.projects.table = this.$store.state.projects.projects
    },
  },
})
</script>
