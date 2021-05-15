import { useSnackbar as useSnack } from '@/store/useSnackbar'

export const useSnackbar = () => {
  const snackbarStore = useSnack()

  const show = (message: string, timeout = 5000, color?: string) => {
    snackbarStore.$patch({ message, timeout, color })
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
