<template>
  <v-dialog v-model="dialog" max-width="650">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="project"
              :items="projects.auto"
              :loading="loading"
              :search-input.sync="search.auto"
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
          v-model="search.table"
          label="Search projects"
          outlined
          autocomplete="off"
          hide-details="auto"
        ></v-text-field>

        <v-expand-transition>
          <v-data-table
            :items="projects.table"
            :headers="headers"
            :search="search.table"
            :server-items-length="$store.state.projects.total"
            show-select
            single-select
            @item-selected="onTableSelected"
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
import { FindAllProjectsDto } from '../../backend/src/project/dto/find-all-projects.dto'
import { Project } from '~/../backend/src/project/project.entity'

export default Vue.extend({
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  async fetch() {
    await this.$store.dispatch('projects/findAll', {
      limit: this.pagination.limit,
      offset: this.pagination.offset,
    })
  },
  data() {
    return {
      dialog: false,
      search: {
        auto: '',
        table: '',
      },
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
      ],
      throttled: false,
      throttler: null as DebouncedFunc<any> | null,
      pagination: {
        total: 0,
        limit: 10,
        offset: 0,
        sort: [] as string[],
      },
      projects: {
        auto: [] as Project[],
        table: [] as Project[],
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
      return this.throttled || this.$store.getters['projects/isLoading']
    },
  },
  watch: {
    'search.auto'() {
      this.searchAuto()
    },
    'search.table'() {
      this.searchTable()
    },
  },
  methods: {
    async searchAuto() {
      await this.findAll({
        search: this.search.auto,
        limit: this.pagination.limit,
      })

      this.projects.auto = this.$store.state.projects.projects
    },
    async searchTable() {
      const all = this.pagination.limit === -1

      await this.findAll({
        search: this.search.table,
        limit: all ? undefined : this.pagination.limit,
        offset: all ? undefined : this.pagination.offset,
        sort: this.pagination.sort.length ? this.pagination.sort : undefined,
      })

      this.projects.table = this.$store.state.projects.projects
      this.projects.auto = this.$store.state.projects.projects
    },
    async findAll(dto: FindAllProjectsDto) {
      this.throttled = true

      if (!this.throttler) {
        this.throttler = throttle(async (dto: FindAllProjectsDto) => {
          await this.$store.dispatch('projects/findAll', dto)
          this.throttled = false
        }, 500)
      }

      await this.throttler(dto)
    },
    onTableSelected(value: any) {
      this.project = value.item.id
    },
    onTableOptionsChange(options: DataTableOptions) {
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

      this.searchTable()
    },
  },
})
</script>
