<template>
  <v-dialog v-model="dialog" max-width="440">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn v-bind="attrs" large icon v-on="on">
          <v-icon>mdi-folder-plus-outline</v-icon>
        </v-btn>
      </slot>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title>Create Course</v-toolbar-title>

        <v-spacer />
      </v-toolbar>

      <VFormValidated v-slot="{ passes }" @form:submit="onSubmit">
        <v-card-text>
          <AlertError :error="error" />

          <v-row>
            <v-col v-if="!project" cols="12">
              <VAutocompleteValidated
                v-model="newProject"
                label="Project"
                :rules="{ required: !project }"
                item-value="id"
                hide-details="auto"
                outlined
              />
            </v-col>

            <v-col cols="12">
              <VTextFieldValidated
                v-model="dto.name"
                label="Name"
                rules="required"
                hide-details="auto"
                required
                outlined
              />
            </v-col>

            <v-col cols="12">
              <VTextareaValidated
                v-model="dto.description"
                label="Description (Optional)"
                hide-details="auto"
                outlined
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn text type="submit" :disabled="!passes" :loading="isLoading">
            Create
          </v-btn>
        </v-card-actions>
      </VFormValidated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  toRefs,
} from '@nuxtjs/composition-api'
import { useCourses } from '@/stores'

export default defineComponent({
  props: {
    project: {
      type: Number as PropType<number | null>,
      default: null,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      dialog: false,
      newProject: null as number | null,
      dto: {
        name: '',
        description: '',
      },
    })

    const courseStore = useCourses()

    const onSubmit = async () => {
      const dto = {
        ...state.dto,
        project: props.project || state.newProject!,
      }

      const course = await courseStore.create(dto)

      if (!courseStore.error) {
        emit('create:course', course)
        state.dialog = false
      }
    }

    return {
      ...toRefs(state),
      error: computed(() => courseStore.error),
      isLoading: computed(() => courseStore.isLoading),
      onSubmit,
    }
  },
})
</script>
