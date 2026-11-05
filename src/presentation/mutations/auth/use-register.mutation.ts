import { useMutation } from '@tanstack/vue-query'
import { registerUseCase } from '@/composition/auth'

export const useRegisterMutation = () => useMutation({ mutationFn: registerUseCase })
