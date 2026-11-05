import { useMutation } from '@tanstack/vue-query'
import { loginUseCase } from '@/di/auth'

export const useLoginMutation = () => useMutation({ mutationFn: loginUseCase })
