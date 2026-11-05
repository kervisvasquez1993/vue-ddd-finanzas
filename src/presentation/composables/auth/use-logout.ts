import { useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/presentation/stores/auth.store'

/** Solo del lado del cliente: el backend no tiene logout y el token vale hasta su `exp`. */
export const useLogout = () => {
  const router = useRouter()
  const authStore = useAuthStore()
  const queryClient = useQueryClient()

  return () => {
    authStore.clearSession()
    queryClient.clear()
    router.push({ name: 'login' })
  }
}
