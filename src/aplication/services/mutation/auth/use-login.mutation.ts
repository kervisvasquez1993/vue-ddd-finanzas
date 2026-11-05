import { useMutation } from '@tanstack/vue-query'
import { loginUseCase } from '@/aplication/use-cases/auth'

export const useLoginMutation = () => useMutation({ mutationFn: loginUseCase })
