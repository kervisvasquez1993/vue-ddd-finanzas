import { useMutation } from '@tanstack/vue-query'
import { deleteTransactionUseCase } from '@/modules/transaction/di'
import { useInvalidateTransactionData } from './use-invalidate-transaction-data'

export const useDeleteTransactionMutation = () => {
  const invalidate = useInvalidateTransactionData()

  // También al fallar: un 404 indica que la lista en pantalla quedó desactualizada.
  return useMutation({ mutationFn: deleteTransactionUseCase, onSettled: invalidate })
}
