import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { createCategoryUseCase } from '@/modules/category/di'
import { categoryKeys } from '@/modules/category/presentation/queries'

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategoryUseCase,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}
