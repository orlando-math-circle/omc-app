import { useSnackbar as useSnack } from '@/stores'

export const useSnackbar = () => {
  const snackbarStore = useSnack()

  const show = (message: string, timeout = 5000, color?: string) => {
    snackbarStore.show = false

    setTimeout(() => {
      snackbarStore.$patch({ message, timeout, color, show: true })
    }, 250)
  }

  const success = (message: string, timeout = 5000) =>
    show(message, timeout, 'success')

  const error = (message: string, timeout = 5000) =>
    show(message, timeout, 'error')

  return {
    show,
    success,
    error,
  }
}
