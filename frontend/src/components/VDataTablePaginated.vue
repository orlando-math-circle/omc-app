<template>
  <v-data-table
    v-model="selections"
    v-bind="$attrs"
    @update:options="onChangeOptions"
  >
    <template
      v-for="(_, scopedSlotName) in $scopedSlots"
      #[scopedSlotName]="slotData"
    >
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>

    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { debounce } from 'lodash'
import { DataTableOptions } from '~/interfaces/data-table.interface'

@Component
export default class VDataTablePaginated extends Vue {
  @Prop() value!: any
  @Prop() search?: string

  get selections() {
    return this.value
  }

  set selections(value: any) {
    this.$emit('input', value)
  }

  pagination = {
    total: 0,
    limit: 40,
    offset: 0,
    sort: [] as string[],
  }

  @Watch('search')
  onSearch() {
    this.refresh()
  }

  get trimmedSearch() {
    if (!this.search) return undefined

    return this.search.trim()
  }

  refresh = debounce(this.refreshDebounced, 500)

  refreshDebounced() {
    this.$emit('refresh', {
      contains: this.trimmedSearch,
      limit: this.pagination.limit,
      offset: this.pagination.offset,
      sort: this.pagination.sort,
    })
  }

  onChangeOptions(options: DataTableOptions) {
    this.pagination.limit = options.itemsPerPage
    this.pagination.offset = this.pagination.limit * (options.page - 1)
    this.pagination.sort = []

    if (options.sortBy.length) {
      for (let i = 0; i < options.sortBy.length; i++) {
        this.pagination.sort[i] = `${options.sortBy[i]}:${
          options.sortDesc[i] ? 'DESC' : 'ASC'
        }`
      }
    }

    this.refresh()
  }
}
</script>
