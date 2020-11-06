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

      <v-form-validated v-slot="{ passes }" @submit:form="onSubmit">
        <v-card-text>
          <alert-error v-if="error" :error="error" />

          <v-text-field-validated
            v-model="dto.name"
            label="Course Name"
            rules="required"
            required
            outlined
          ></v-text-field-validated>

          <v-textarea
            v-model="dto.description"
            label="Course Description"
            outlined
          ></v-textarea>

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
              <v-text-field-validated
                v-model.number="dto.fee"
                label="Fee"
                type="number"
                :rules="{
                  required: dto.paymentType !== 'free',
                  positive: true,
                }"
                prefix="$"
                outlined
              ></v-text-field-validated>
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
              <v-text-field-validated
                v-model.number="dto.lateFee"
                label="Late Fee"
                type="number"
                :rules="{
                  required: dto.latePaymentType === 'latefee',
                  positive: true,
                }"
                prefix="$"
                outlined
              ></v-text-field-validated>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text
            type="submit"
            :disabled="!passes"
            :loading="$accessor.courses.isLoading"
            >Create</v-btn
          >
        </v-card-actions>
      </v-form-validated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class DialogCreateCourse extends Vue {
  @Prop() project!: number | null

  dialog = false

  paymentTypes = [
    { text: 'Free', value: 'free' },
    { text: 'Per-Event', value: 'single' },
    { text: 'All', value: 'all' },
  ]

  latePaymentTypes = [
    { text: 'Forbid Registration', value: 'deny' },
    { text: 'Normal Payment', value: 'default' },
    { text: 'Late Fee', value: 'latefee' },
  ]

  dto = {
    name: '',
    description: '',
    paymentType: 'free',
    latePaymentType: 'default',
    fee: 0,
    lateFee: 0,
  }

  get error() {
    return this.$accessor.courses.error
  }

  async onSubmit() {
    const fee =
      this.dto.fee % 1 === 0 ? `${this.dto.fee}.00` : this.dto.fee.toString()

    const dto = {
      name: this.dto.name,
      description: this.dto.description,
      paymentType: this.dto.paymentType,
      latePaymentType: this.dto.latePaymentType,
      project: this.project,
      fee,
      lateFee: this.dto.lateFee.toString(),
    }

    const course = await this.$accessor.courses.create(dto as any)

    if (!this.error) {
      this.$emit('create:course', course)
      this.dialog = false
    }
  }
}
</script>
