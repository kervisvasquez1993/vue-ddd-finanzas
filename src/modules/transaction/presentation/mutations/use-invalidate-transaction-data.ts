import { useQueryClient } from '@tanstack/vue-query'
import { queryRoots } from '@/shared/presentation/queries/query-roots'

/** Una transacción cambia su lista, el dashboard y los totales por categoría. */
export const useInvalidateTransactionData = () => {
  const queryClient = useQueryClient()

  return () =>
    Promise.all(
      Object.values(queryRoots).map((queryKey) => queryClient.invalidateQueries({ queryKey })),
    )
}
