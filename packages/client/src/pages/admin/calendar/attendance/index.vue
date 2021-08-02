<template>
  <div>
    <AdminHeader title="Attendance" :breadcrumbs="breadcrumbs" />

    <v-row>
      <v-col>
        <v-card :loading="isLoading">
          <v-card-title>
            <v-spacer />

            <v-btn class="ml-3" icon large @click="onRefresh()">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>

          <DataTableAttendances
            :attendances="attendances"
            @refresh="onRefresh"
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useAttendance } from '@/stores'

const breadcrumbs = [
  {
    text: 'Dashboard',
    href: '/admin/',
  },
  {
    text: 'Attendance',
  },
]

export default defineComponent({
  layout: 'admin',
  transition: 'admin',
  setup() {
    const attendanceStore = useAttendance()

    const attendances = computed(() => attendanceStore.attendances)
    const isLoading = computed(() => attendanceStore.isLoading)

    const onRefresh = async () => {
      await attendanceStore.findAll()
    }

    return {
      attendances,
      breadcrumbs,
      isLoading,
      onRefresh,
    }
  },
  async asyncData({ pinia }) {
    const attendanceStore = useAttendance(pinia)

    await attendanceStore.findAll()
  },
  head: {
    title: 'Attendances',
  },
})
</script>
