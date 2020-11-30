<template>
  <dialog-form
    ref="dialogEl"
    :expands="false"
    width="440"
    @submit:form="onSubmit"
  >
    <template #title>Create Work</template>

    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="attrs" v-on="on"></slot>
    </template>

    <v-card-text>
      <v-row>
        <v-col cols="12">
          <auto-complete-user
            v-model="dto.user"
            rules="required"
            item-value="id"
            label="User"
            outlined
          ></auto-complete-user>
        </v-col>

        <v-col cols="12">
          <auto-complete-project
            v-model="dto.project"
            rules="required"
            item-value="id"
            label="Project (Optional)"
            outlined
          ></auto-complete-project>
        </v-col>

        <v-col cols="12">
          <v-text-field-validated
            v-model.number="dto.hours"
            rules="required"
            label="Hours"
            hint="The hours to award (or deduct)"
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

        Create Work
      </v-btn>
    </v-card-actions>
  </dialog-form>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import DialogForm from './DialogForm.vue'

@Component
export default class DialogCreateWork extends Vue {
  @Ref('dialogEl') readonly dialog!: DialogForm

  success = false

  dto = {
    project: null as null | number,
    user: null as null | number,
    hours: 0,
  }

  get isLoading() {
    return this.$accessor.volunteers.isLoading
  }

  async onSubmit() {
    const work = await this.$accessor.volunteers.createWork(this.dto as any)

    if (this.$accessor.volunteers.isErrored) {
      return this.$snack('Error while creating new work :(')
    }

    this.$emit('create:work', work)
    this.dialog.close()
  }
}
</script>
