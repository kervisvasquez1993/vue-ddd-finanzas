import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { createCategoryUseCase } from '@/di/category'
import { categoryKeys } from '@/presentation/queries/category'

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategoryUseCase,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}
