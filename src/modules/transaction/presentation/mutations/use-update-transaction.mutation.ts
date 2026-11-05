import { useMutation } from '@tanstack/vue-query'
import { updateTransactionUseCase } from '@/modules/transaction/di'
import { useInvalidateTransactionData } from './use-invalidate-transaction-data'

export const useUpdateTransactionMutation = () => {
  const invalidate = useInvalidateTransactionData()

  return useMutation({ mutationFn: updateTransactionUseCase, onSuccess: invalidate })
}
