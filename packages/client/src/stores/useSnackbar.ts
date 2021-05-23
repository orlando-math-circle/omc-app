import { defineStore } from 'pinia'

export const useSnackbar = defineStore({
  id: 'snackbar',
  state: () => ({
    show: false,
    message: '',
    color: null as string | null,
    timeout: null as number | null,
  }),
})
