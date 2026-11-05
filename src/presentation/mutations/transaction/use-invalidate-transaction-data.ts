import { useQueryClient } from '@tanstack/vue-query'
import { categoryKeys } from '@/presentation/queries/category'
import { dashboardKeys } from '@/presentation/queries/dashboard'
import { transactionKeys } from '@/presentation/queries/transaction'

/** Una transacción cambia su lista, el dashboard y los totales por categoría. */
export const useInvalidateTransactionData = () => {
  const queryClient = useQueryClient()

  return () =>
    Promise.all(
      [transactionKeys.all, dashboardKeys.all, categoryKeys.all].map((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    )
}
