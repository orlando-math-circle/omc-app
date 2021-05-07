<template>
  <v-row>
    <v-col cols="6">
      <VSelectValidated
        v-model="fields.month"
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
        v-model.number="fields.date"
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
        v-model.number="fields.year"
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
  reactive,
  toRefs,
  watch,
} from '@nuxtjs/composition-api'
import { months } from '~/utils/constants'
import { isValidDate } from '~/utils/utilities'
import { daysInMonth } from '~/utils/time'
import useStateReset from '~/composables/useStateReset'

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
    const { state, reset } = useStateReset({
      fields: {
        month: null as number | null,
        date: null as number | null,
        year: null as number | null,
      },
      dirty: reactive({
        month: false,
        date: false,
        year: false,
      }),
    })

    const date = computed(() => {
      // If the fields are empty then there is no internal date.
      if (!state.fields.year || !state.fields.month || !state.fields.date) {
        return ''
      }

      return new Date(
        state.fields.year,
        state.fields.month,
        state.fields.date
      ).toISOString()
    })

    const fromISO = () => {
      if (props.value === date.value) {
        return
      }

      if (props.value === '') {
        return reset()
      }

      const newDate = new Date(props.value)

      if (!isValidDate(newDate)) return

      state.fields.year = newDate.getFullYear()
      state.fields.month = newDate.getMonth()
      state.fields.date = newDate.getDate()
    }

    /**
     * Emits the blur event only after each birthday
     * input has been blurred to prevent premature errors.
     */
    const onBlur = (type: keyof typeof state['dirty']) => {
      state.dirty[type] = true

      if (state.dirty.month && state.dirty.date && state.dirty.year) {
        emit('blur')
      }
    }

    watch(() => props.value, fromISO, { immediate: true })
    watch(state.fields, () => emit('input', date.value))

    /**
     * Applies rules ensuring the user doesn't create a birthday
     * with an invalid number of days in the month.
     */
    const dayRules = computed(() => {
      if (!state.fields.month || !state.fields.year) {
        return {
          required: true,
          min_value: 1,
        }
      }

      return {
        required: true,
        min_value: 1,
        max_value: daysInMonth(state.fields.month, state.fields.year),
      }
    })

    const monthSelections = computed(() =>
      months.map((m, i) => ({ text: m, value: i }))
    )

    return {
      ...toRefs(state),
      onBlur,
      months: monthSelections,
      dayRules,
    }
  },
})
</script>
