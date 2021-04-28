<template>
  <v-row dense>
    <v-col cols="6">
      <VSelectValidated
        v-model="month"
        label="Birthday Month"
        autocomplete="bday-month"
        name="Birthday Month"
        rules="required"
        :items="months"
        hide-details="auto"
        outlined
        v-bind="$attrs"
        @blur="onBlur('month')"
      />
    </v-col>

    <v-col cols="3">
      <VTextFieldValidated
        ref="dateField"
        v-model.number="date"
        type="tel"
        maxlength="2"
        :rules="dayRules"
        name="Date"
        label="Day"
        hide-details="auto"
        outlined
        v-bind="$attrs"
        @blur="onBlur('date')"
      />
    </v-col>

    <v-col cols="3">
      <VTextFieldValidated
        ref="yearField"
        v-model.number="year"
        type="tel"
        maxlength="4"
        rules="required"
        name="Year"
        label="Year"
        hide-details="auto"
        outlined
        v-bind="$attrs"
        @blur="onBlur('year')"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  watch,
} from '@nuxtjs/composition-api'
import { months } from '~/utils/constants'
import { isValidDate } from '~/utils/utilities'

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
    maxYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    minYear: {
      type: Number,
      default: new Date().getFullYear() - 100,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      month: null as number | null,
      date: null as number | null,
      year: null as number | null,
    })

    const dirty = reactive({
      month: false,
      date: false,
      year: false,
    })

    /**
     * Emits the blur event only after each birthday
     * input has been blurred to prevent premature errors.
     */
    const onBlur = (type: keyof typeof dirty) => {
      dirty[type] = true

      if (dirty.month && dirty.date && dirty.year) {
        emit('blur')
      }
    }

    watch(
      () => state,
      (birthday: typeof state) => {
        if (
          typeof birthday.year !== 'number' ||
          typeof birthday.month !== 'number' ||
          typeof birthday.date !== 'number'
        )
          return

        const date = new Date(
          birthday.year as number,
          birthday.month as number,
          birthday.date as number
        )

        if (!isValidDate(date)) return

        emit('input', date.toISOString())
      },
      { deep: true }
    )

    const daysInMonth = (month: number, year: number) => {
      return new Date(year, month + 1, 0).getDate()
    }

    /**
     * Applies rules ensuring the user doesn't create a birthday
     * with an invalid number of days in the month.
     */
    const dayRules = computed(() => {
      if (typeof state.month !== 'number' || typeof state.year !== 'number') {
        return {
          required: true,
          min_value: 1,
        }
      }

      return {
        required: true,
        min_value: 1,
        max_value: daysInMonth(state.month, state.year),
      }
    })

    const monthSelections = computed(() =>
      months.map((m, i) => ({ text: m, value: i }))
    )

    onMounted(() => {
      if (typeof props.value !== 'string') return

      const date = new Date(props.value)

      if (!isValidDate(date)) return

      state.year = date.getFullYear()
      state.month = date.getMonth()
      state.date = date.getDate()
    })

    return {
      ...toRefs(state),
      onBlur,
      months: monthSelections,
      dayRules,
    }
  },
})
</script>
