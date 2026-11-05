import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { deleteCategoryUseCase } from '@/di/category'
import { categoryKeys } from '@/presentation/queries/category'

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCategoryUseCase,
    // También al fallar: un 404 o un 409 indican que la lista en pantalla quedó desactualizada.
    onSettled: () => queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}
