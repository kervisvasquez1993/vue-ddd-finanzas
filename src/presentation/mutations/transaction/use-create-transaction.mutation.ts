import { useMutation } from '@tanstack/vue-query'
import { createTransactionUseCase } from '@/di/transaction'
import { useInvalidateTransactionData } from './use-invalidate-transaction-data'

export const useCreateTransactionMutation = () => {
  const invalidate = useInvalidateTransactionData()

  return useMutation({ mutationFn: createTransactionUseCase, onSuccess: invalidate })
}
