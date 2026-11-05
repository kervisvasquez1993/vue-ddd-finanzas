import { useMutation } from '@tanstack/vue-query'
import { loginUseCase } from '@/modules/auth/di'

export const useLoginMutation = () => useMutation({ mutationFn: loginUseCase })
