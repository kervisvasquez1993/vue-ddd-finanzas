import { useMutation } from '@tanstack/vue-query'
import { updateTransactionUseCase } from '@/di/transaction'
import { useInvalidateTransactionData } from './use-invalidate-transaction-data'

export const useUpdateTransactionMutation = () => {
  const invalidate = useInvalidateTransactionData()

  return useMutation({ mutationFn: updateTransactionUseCase, onSuccess: invalidate })
}
