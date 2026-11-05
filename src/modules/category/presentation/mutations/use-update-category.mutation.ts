import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateCategoryUseCase } from '@/modules/category/di'
import { categoryKeys } from '@/modules/category/presentation/queries'
import { queryRoots } from '@/shared/presentation/queries/query-roots'

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCategoryUseCase,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
        // El dashboard y las transacciones muestran el nombre de la categoría.
        queryClient.invalidateQueries({ queryKey: queryRoots.dashboard }),
        queryClient.invalidateQueries({ queryKey: queryRoots.transactions }),
      ]),
  })
}
