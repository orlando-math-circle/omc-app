<template>
  <dialog-form
    ref="dialogEl"
    :expands="false"
    width="440"
    @submit:form="onSubmit"
  >
    <template #title>Create Job</template>

    <template #activator="{ on, attrs }">
      <v-tooltip bottom>
        <template #activator="tooltip">
          <slot
            name="activator"
            v-bind="{
              attrs: { ...attrs, ...tooltip.attrs },
              on: { ...tooltip.on, ...on },
            }"
          ></slot>
        </template>

        <span>Create Job</span>
      </v-tooltip>
    </template>

    <v-card-text>
      <v-row>
        <v-col v-if="!isStatic" cols="12">
          <auto-complete-project
            v-model="project"
            label="Project (Optional)"
            :rules="{ required: !isStatic }"
            item-value="id"
            outlined
          ></auto-complete-project>
        </v-col>

        <v-col cols="12">
          <v-text-field-validated
            v-model="dto.name"
            rules="required"
            label="Job Name"
            outlined
            hide-details="auto"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea-validated
            v-model="dto.description"
            label="Description"
            outlined
            hide-details="auto"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field-validated
            v-model.number="dto.hours"
            type="number"
            label="Volunteer Hours"
            hint="Hours to award on job completion"
            outlined
            hide-details="auto"
          />
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer />

      <v-btn text @click="dialog.close()">Cancel</v-btn>
      <v-btn text type="submit" :loading="isLoading" color="secondary">
        <v-scroll-x-transition>
          <v-icon v-if="success" class="mr-2" color="success">
            mdi-check
          </v-icon>
        </v-scroll-x-transition>

        Create Job
      </v-btn>
    </v-card-actions>
  </dialog-form>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'nuxt-property-decorator'
import DialogForm from './DialogForm.vue'

@Component
export default class DialogCreateJob extends Vue {
  @Ref('dialogEl') readonly dialog!: DialogForm
  @Prop({ default: true }) readonly isStatic!: boolean

  success = false
  project: null | number = null

  dto = {
    name: '',
    description: '',
    hours: 0,
  }

  get isLoading() {
    return this.$accessor.volunteers.isLoading
  }

  async onSubmit() {
    if (this.isStatic) {
      this.$emit('create:job', { ...this.dto })
      this.dialog.close()
      return
    }

    await this.$accessor.volunteers.create({
      ...this.dto,
      ...{ project: this.project! },
    })

    if (this.$accessor.volunteers.isErrored) {
      return this.$snack('Error while creating new job :(')
    }

    this.$emit('create:job', this.$accessor.volunteers.job)
    this.dialog.close()
  }
}
</script>
