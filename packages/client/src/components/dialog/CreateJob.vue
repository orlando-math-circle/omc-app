<template>
  <DialogForm ref="dialog" :expands="false" width="440" @form:submit="onSubmit">
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
          <AutocompleteProject v-model="project" rules="required" />
        </v-col>

        <v-col cols="12">
          <VTextFieldValidated
            v-model="dto.name"
            rules="required"
            label="Job Name"
            outlined
            hide-details="auto"
          />
        </v-col>

        <v-col cols="12">
          <VTextareaValidated
            v-model="dto.description"
            label="Description"
            outlined
            hide-details="auto"
          />
        </v-col>

        <v-col cols="12">
          <VTextFieldValidated
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

      <v-btn text @click="dialog && dialog.close()">Cancel</v-btn>
      <v-btn text type="submit" :loading="isLoading" color="secondary">
        <v-scroll-x-transition>
          <v-icon v-if="success" class="mr-2" color="success">
            mdi-check
          </v-icon>
        </v-scroll-x-transition>

        Create Job
      </v-btn>
    </v-card-actions>
  </DialogForm>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  toRefs,
} from '@nuxtjs/composition-api'
import { useSnackbar } from '@/composables'
import { useJobs } from '@/stores'
import DialogForm from '@/components/dialog/Form.vue'

export default defineComponent({
  props: {
    isStatic: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const refs = {
      dialog: ref<InstanceType<typeof DialogForm>>(),
    }

    const state = reactive({
      success: false,
      project: null as number | null,
      dto: {
        name: '',
        description: '',
        hours: 0,
      },
    })

    const jobStore = useJobs()
    const snackbar = useSnackbar()

    const onSubmit = async () => {
      if (props.isStatic) {
        emit('create:job', { ...state.dto })
        refs.dialog.value!.close()
      }

      await jobStore.create({ ...state.dto, ...{ project: state.project! } })

      if (jobStore.error) {
        snackbar.error(jobStore.error.message)
      }

      emit('create:job', jobStore.job)
      refs.dialog.value!.close()
    }

    return {
      ...refs,
      ...toRefs(state),
      isLoading: computed(() => jobStore.isLoading),
      onSubmit,
    }
  },
})
</script>
