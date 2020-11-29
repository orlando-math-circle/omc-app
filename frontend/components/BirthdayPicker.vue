<template>
  <v-row>
    <v-col cols="6">
      <v-select-validated
        v-model="birthday.month"
        label="Birthday Month"
        autocomplete="bday-month"
        name="Birthday Month"
        rules="required"
        :items="months"
        hide-details="auto"
        v-bind="$attrs"
      />
    </v-col>

    <v-col cols="3">
      <v-text-field-validated
        ref="dateField"
        v-model.number="birthday.date"
        type="tel"
        maxlength="2"
        :rules="dayRules"
        name="Date"
        label="Day"
        hide-details="auto"
        v-bind="$attrs"
      />
    </v-col>

    <v-col cols="3">
      <v-text-field-validated
        ref="yearField"
        v-model.number="birthday.year"
        type="tel"
        maxlength="4"
        rules="required"
        name="Year"
        label="Year"
        hide-details="auto"
        v-bind="$attrs"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
import { isValidDate } from '~/utils/utilities'

@Component
export default class BirthdayPicker extends Vue {
  @Prop() value!: string | null
  @Prop({ default: new Date().getFullYear() }) readonly maxYear!: number
  @Prop({ default: new Date().getFullYear() - 100 }) readonly minYear!: number

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
    date: null as number | null,
    year: null as number | null,
  }

  @Watch('birthday', { deep: true })
  setDate(birthday: this['birthday']) {
    if (!birthday.year || !birthday.month || !birthday.date) return

    const date = new Date(
      birthday.year as number,
      birthday.month as number,
      birthday.date as number
    )

    if (!isValidDate(date)) return

    this.$emit('input', date.toISOString())
  }

  /**
   * Applies rules ensuring the user doesn't create a birthday
   * with an invalid number of days in the month.
   */
  get dayRules() {
    if (!this.birthday.month || !this.birthday.year) {
      return {
        required: true,
        min_value: 1,
      }
    }

    return {
      required: true,
      min_value: 1,
      max_value: this.daysInMonth(this.birthday.month, this.birthday.year),
    }
  }

  daysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate()
  }

  mounted() {
    if (typeof this.value !== 'string') return

    const date = new Date(this.value)

    if (!isValidDate(date)) return

    this.birthday.year = date.getFullYear()
    this.birthday.month = date.getMonth()
    this.birthday.date = date.getDate()
  }
}
</script>
