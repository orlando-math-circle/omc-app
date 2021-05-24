<template>
  <DialogForm ref="dialog" :expands="false" width="440" @form:submit="onSubmit">
    <template #title>Create Work</template>

    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }" />
    </template>

    <v-card-text>
      <v-row>
        <v-col cols="12">
          <AutoCompleteUser
            v-model="dto.user"
            rules="required"
            item-value="id"
            label="User"
            outlined
          />
        </v-col>

        <v-col cols="12">
          <AutoCompleteProject
            v-model="dto.project"
            rules="required"
            item-value="id"
            label="Project (Optional)"
            outlined
          />
        </v-col>

        <v-col cols="12">
          <VTextFieldValidated
            v-model.number="dto.hours"
            rules="required"
            label="Hours"
            hint="The hours to award (or deduct)"
            outlined
            hide-details="auto"
          />
        </v-col>

        <v-col cols="12">
          <VTextFieldValidated
            v-model.number="dto.notes"
            label="Notes"
            outlined
            hide-details="auto"
          />
        </v-col>

        <v-col cols="12">
          <VSelectValidated
            v-model="dto.status"
            rules="required"
            :items="workStatuses"
            label="Status"
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

        Create Work
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
import { VolunteerWorkStatus } from '@server/volunteer-work/enums/work-status.enum'
import { useSnackbar } from '@/composables'
import { useWork } from '@/stores'
import { workStatuses } from '@/utils/constants'
import DialogForm from '@/components/dialog/Form.vue'

export default defineComponent({
  setup(_, { emit }) {
    const refs = {
      dialog: ref<InstanceType<typeof DialogForm>>(),
    }

    const state = reactive({
      success: false,
      dto: {
        project: null as null | number,
        user: null as null | number,
        hours: 0,
        notes: '',
        status: VolunteerWorkStatus.APPROVED,
      },
    })

    const workStore = useWork()
    const snackbar = useSnackbar()

    const isLoading = computed(() => workStore.isLoading)

    const onSubmit = async () => {
      const work = await workStore.create({
        project: state.dto.project!,
        user: state.dto.user!,
        hours: state.dto.hours,
        notes: state.dto.notes,
        status: state.dto.status,
      })

      if (workStore.error) {
        snackbar.error(workStore.error.message)
      }

      emit('create:work', work)
      refs.dialog.value!.close()
    }

    return { ...refs, ...toRefs(state), workStatuses, isLoading, onSubmit }
  },
})
</script>
