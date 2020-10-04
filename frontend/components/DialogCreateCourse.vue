<template>
  <v-dialog v-model="dialog" max-width="440">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn v-bind="attrs" large text v-on="on">Create</v-btn>
      </slot>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title>Create Course</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-toolbar>

      <ValidationObserver v-slot="{ passes, passed }" ref="form">
        <v-form @submit.prevent="passes(onSubmit)">
          <v-card-text>
            <alert-error v-if="error" :error="error" />

            <ValidationProvider v-slot="{ errors }" rules="required">
              <v-text-field
                v-model="dto.name"
                label="Course Name"
                required
                :error-messages="errors"
                outlined
              />
            </ValidationProvider>

            <v-textarea
              v-model="dto.description"
              label="Course Description"
              outlined
            />

            <v-row>
              <v-col>
                <v-select
                  v-model="dto.paymentType"
                  :items="paymentTypes"
                  label="Payment Mode"
                  outlined
                />
              </v-col>

              <v-col v-if="dto.paymentType !== 'free'">
                <v-text-field
                  v-model.number="dto.fee"
                  label="Fee"
                  type="number"
                  prefix="$"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row v-if="dto.paymentType !== 'free'">
              <v-col>
                <v-select
                  v-model="dto.latePaymentType"
                  :items="latePaymentTypes"
                  label="Late Payment Mode"
                  outlined
                />
              </v-col>

              <v-col v-if="dto.latePaymentType === 'latefee'">
                <v-text-field
                  v-model.number="dto.lateFee"
                  label="Late Fee"
                  type="number"
                  prefix="$"
                  outlined
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text
              type="submit"
              :disabled="!passed"
              :loading="$store.getters['courses/isLoading']"
              >Create</v-btn
            >
          </v-card-actions>
        </v-form>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { CreateCourseDto } from '~/../backend/src/course/dto/create-course.dto'
import { PaymentType } from '~/../backend/src/course/enums/payment-type.enum'
import { LatePaymentType } from '~/../backend/src/course/enums/late-payment-type.enum'

export default Vue.extend({
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    project: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      paymentTypes: [
        { text: 'Free', value: 'free' },
        { text: 'Per-Event', value: 'single' },
        { text: 'All', value: 'all' },
      ],
      latePaymentTypes: [
        { text: 'Forbid Registration', value: 'deny' },
        { text: 'Normal Payment', value: 'default' },
        { text: 'Late Fee', value: 'latefee' },
      ] as Array<{ text: string; value: LatePaymentType }>,
      dto: {
        name: '',
        description: '',
        paymentType: 'free' as PaymentType,
        latePaymentType: 'default' as LatePaymentType,
        fee: 0,
        lateFee: 0,
      },
    }
  },
  computed: {
    error(): Error {
      return this.$store.state.courses.error
    },
  },
  methods: {
    async onSubmit() {
      const dto: CreateCourseDto = {
        name: this.dto.name,
        description: this.dto.description,
        paymentType: this.dto.paymentType,
        latePaymentType: this.dto.latePaymentType,
        project: this.project,
        fee: this.dto.fee.toString(),
        lateFee: this.dto.lateFee.toString(),
      }

      const course = await this.$store.dispatch('courses/create', dto)

      if (!this.error) {
        this.$emit('create:course', course)
        this.dialog = false
      }
    },
  },
})
</script>
