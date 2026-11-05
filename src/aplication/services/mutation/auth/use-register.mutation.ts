import { useMutation } from '@tanstack/vue-query'
import { registerUseCase } from '@/aplication/use-cases/auth'

export const useRegisterMutation = () => useMutation({ mutationFn: registerUseCase })
