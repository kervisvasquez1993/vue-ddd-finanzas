import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateCategoryUseCase } from '@/composition/category'
import { categoryKeys } from '@/presentation/queries/category'
import { dashboardKeys } from '@/presentation/queries/dashboard'

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCategoryUseCase,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
        // El dashboard muestra los nombres de las categorías con más salidas.
        queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
      ]),
  })
}
