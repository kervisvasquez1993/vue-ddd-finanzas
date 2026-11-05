import { useMutation } from '@tanstack/vue-query'
import { registerUseCase } from '@/modules/auth/di'

export const useRegisterMutation = () => useMutation({ mutationFn: registerUseCase })
