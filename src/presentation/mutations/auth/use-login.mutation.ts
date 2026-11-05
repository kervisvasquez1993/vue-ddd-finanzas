import { useMutation } from '@tanstack/vue-query'
import { loginUseCase } from '@/composition/auth'

export const useLoginMutation = () => useMutation({ mutationFn: loginUseCase })
