import { useMutation } from '@tanstack/vue-query'
import { createTransactionUseCase } from '@/modules/transaction/di'
import { useInvalidateTransactionData } from './use-invalidate-transaction-data'

export const useCreateTransactionMutation = () => {
  const invalidate = useInvalidateTransactionData()

  return useMutation({ mutationFn: createTransactionUseCase, onSuccess: invalidate })
}
