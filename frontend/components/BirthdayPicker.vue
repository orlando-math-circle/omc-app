<template>
  <v-row>
    <v-col cols="6">
      <v-select-validated
        v-model="birthday.month"
        label="Birthday Month"
        autocomplete="bday-month"
        :items="months"
        hide-details
        v-bind="$attrs"
      ></v-select-validated>
    </v-col>

    <v-col cols="3">
      <v-text-field-validated
        v-model.number="birthday.day"
        type="number"
        label="Day"
        hide-details
        v-bind="$attrs"
      ></v-text-field-validated>
    </v-col>

    <v-col cols="3">
      <v-text-field-validated
        v-model.number="birthday.year"
        type="number"
        label="Year"
        hide-details
        v-bind="$attrs"
      ></v-text-field-validated>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
import { isValidDate } from '~/utils/utilities'

@Component
export default class BirthdayPicker extends Vue {
  @Prop() value!: string | null

  months = [
    { text: 'January', value: 0 },
    { text: 'February', value: 1 },
    { text: 'March', value: 2 },
    { text: 'April', value: 3 },
    { text: 'May', value: 4 },
    { text: 'June', value: 5 },
    { text: 'July', value: 6 },
    { text: 'August', value: 7 },
    { text: 'September', value: 8 },
    { text: 'October', value: 9 },
    { text: 'November', value: 10 },
    { text: 'December', value: 11 },
  ]

  birthday = {
    month: null as number | null,
    day: null as number | null,
    year: null as number | null,
  }

  @Watch('birthday', { deep: true })
  setDate(birthday: this['birthday']) {
    const date = new Date(
      birthday.year as number,
      birthday.month as number,
      birthday.day as number
    )

    if (!isValidDate(date)) return

    this.$emit('input', date.toISOString())
  }

  mounted() {
    if (typeof this.value !== 'string') return

    const date = new Date(this.value)

    if (!isValidDate(date)) return

    this.birthday.year = date.getFullYear()
    this.birthday.month = date.getMonth()
    this.birthday.day = date.getDay()
  }
}
</script>
