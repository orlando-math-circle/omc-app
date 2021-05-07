<template>
  <FormDialog ref="form" @form:submit="onSubmit">
    <template #title>Update User</template>

    <template #form>
      <v-row>
        <v-col cols="6">
          <VTextFieldValidated
            v-model="dto.first"
            label="First Name"
            rules="required"
          />
        </v-col>

        <v-col cols="6">
          <VTextFieldValidated
            v-model="dto.last"
            label="Last Name"
            rules="required"
            field="text"
          />
        </v-col>

        <v-col cols="12">
          <BirthdayPickerValidated v-model="dto.dob" :min-age="0" />
        </v-col>

        <v-col cols="6">
          <VSelectValidated
            v-model="dto.gender"
            :items="genders"
            rules="required"
            label="Gender"
          />
        </v-col>

        <v-col cols="6">
          <VSelect
            v-model="dto.grade"
            :items="grades"
            label="Grade"
            hide-details="auto"
            outlined
          />
        </v-col>
      </v-row>

      <!-- <FormField
        v-model="dto.industry.profession"
        label="Profession (Optional)"
        field="text"
      />

      <FormField
        v-model="dto.industry.jobTitle"
        label="Job Title (Optional)"
        field="text"
      />

      <FormField
        v-model="dto.industry.company"
        label="Company or Workplace (Optional)"
        field="text"
      /> -->
    </template>

    <template #actions="{ passes }">
      <v-spacer />

      <v-btn
        block
        rounded
        type="submit"
        :disabled="!passes"
        :loading="isLoading"
        color="secondary"
      >
        Submit
      </v-btn>
    </template>
  </FormDialog>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  ref,
  useContext,
} from '@nuxtjs/composition-api'
import { User } from '@server/user/user.entity'
import { IndustryDto } from '@server/user/dtos/industry.dto'
import { Gender } from '@server/user/enums/gender.enum'
import { Grade } from '@server/user/enums/grade.enum'
import { genders } from '~/utils/constants'
import { grades } from '~/utils/events'
import FormDialog from '~/components/form/Dialog.vue'

export default defineComponent({
  setup() {
    const { $accessor: store } = useContext()
    const form = ref<InstanceType<typeof FormDialog>>()

    const state = reactive({
      user: null as User | null,
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

    const isLoading = computed(
      () => store.users.isLoading || store.auth.isLoading
    )

    const open = (user: User) => {
      state.user = user

      state.dto.first = user.first
      state.dto.last = user.last
      state.dto.dob = (user.dob as unknown) as string
      state.dto.gender = user.gender
      state.dto.grade = user.grade
      state.dto.email = user.email

      state.dto.industry = user.industry || {
        profession: '',
        jobTitle: '',
        company: '',
      }

      form.value!.open()
    }

    const onSubmit = async () => {
      await store.users.update({
        id: state.user!.id,
        updateUserDto: state.dto,
      })

      if (!store.users.isErrored) {
        // Refresh the account users.
        await store.auth.getAccount()
        form.value!.close()
      }
    }

    return {
      ...toRefs(state),
      form,
      genders,
      grades,
      open,
      onSubmit,
      isLoading,
    }
  },
})
</script>
