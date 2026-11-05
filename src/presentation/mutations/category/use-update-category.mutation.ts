import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateCategoryUseCase } from '@/di/category'
import { categoryKeys } from '@/presentation/queries/category'
import { dashboardKeys } from '@/presentation/queries/dashboard'
import { transactionKeys } from '@/presentation/queries/transaction'

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCategoryUseCase,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
        // El dashboard y las transacciones muestran el nombre de la categoría.
        queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
        queryClient.invalidateQueries({ queryKey: transactionKeys.all }),
      ]),
  })
}
