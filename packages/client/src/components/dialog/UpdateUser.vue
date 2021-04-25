<template>
  <DialogForm ref="formRef" @form:submit="onSubmit">
    <template #activator="activator">
      <slot name="activator" v-bind="activator" />
    </template>

    <template #title>Update User</template>

    <template #form>
      <v-col cols="6">
        <VTextFieldValidated
          v-model="dto.first"
          label="First Name"
          rules="required"
          required
          outlined
        />
      </v-col>

      <v-col cols="6">
        <VTextFieldValidated
          v-model="dto.last"
          label="Last Name"
          rules="required"
          required
          outlined
        />
      </v-col>

      <v-col cols="12">
        <BirthdayPickerValidated v-model="dto.dob" :min-age="0" />
      </v-col>

      <v-col cols="12">
        <VTextFieldValidated
          v-model="dto.email"
          label="Email"
          rules="required"
          required
          outlined
        />
      </v-col>

      <v-col cols="6">
        <VSelectValidated
          v-model="dto.gender"
          :items="genders"
          label="Gender"
          rules="required"
          outlined
          hide-details="auto"
        />
      </v-col>

      <v-col cols="6">
        <VSelectValidated v-model="dto.grade" :items="grades" label="Grade" />
      </v-col>
    </template>

    <template #actions="{ passes }">
      <v-spacer />

      <v-btn type="submit" :disabled="!passes" color="secondary">
        Submit Changes
      </v-btn>
    </template>
  </DialogForm>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
} from '@nuxtjs/composition-api'
import { genders } from '@/utils/constants'
import { grades } from '@/utils/events'
import DialogForm from '@/components/dialog/Form.vue'
import { useTemplateRef } from '@/composables'
import { UserEntity, useUsers } from '@/stores'
import { Gender } from '@server/user/enums/gender.enum'
import { Grade } from '@server/user/enums/grade.enum'
import { IndustryDto } from '@server/user/dtos/industry.dto'
import { difference } from '@/utils/utilities'

type FormComponent = InstanceType<typeof DialogForm>

export default defineComponent({
  setup(_, { emit }) {
    const form = useTemplateRef<FormComponent>('formRef')

    const userStore = useUsers()

    const state = reactive({
      user: null as UserEntity | null,
      dto: {
        first: '',
        last: '',
        dob: '',
        gender: undefined as Gender | undefined,
        grade: undefined as Grade | undefined,
        email: undefined as string | undefined,
        industry: {
          profession: '',
          jobTitle: '',
          company: '',
        } as IndustryDto,
      },
    })

    const open = (user: UserEntity) => {
      state.user = user
      state.dto.first = user.first
      state.dto.last = user.last
      state.dto.dob = user.dob
      state.dto.gender = user.gender
      state.dto.grade = user.grade
      state.dto.email = user.email
      state.dto.industry = user.industry || {
        profession: '',
        jobTitle: '',
        company: '',
      }

      form.value.open()
    }

    const changes = computed(() => {
      const originalUser = { ...state.user }

      // This could be null and would break comparison
      if (!originalUser.industry) {
        originalUser.industry = {
          profession: '',
          jobTitle: '',
          company: '',
        }
      }

      return difference(originalUser, state.dto)
    })

    const onSubmit = async () => {
      await userStore.update(state.user!.id, changes.value, true)

      if (!userStore.error) {
        emit('user:update')
        form.value.close()
      }
    }

    return {
      ...toRefs(state),
      genders,
      onSubmit,
      open,
      grades,
      changes,
    }
  },
})
</script>
