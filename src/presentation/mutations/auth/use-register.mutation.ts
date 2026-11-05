import { useMutation } from '@tanstack/vue-query'
import { registerUseCase } from '@/di/auth'

export const useRegisterMutation = () => useMutation({ mutationFn: registerUseCase })
