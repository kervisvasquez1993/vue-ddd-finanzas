import { useQuery } from '@tanstack/vue-query'
import { getCategoriesUseCase } from '@/modules/category/di'
import { shouldRetryQuery } from '@/shared/presentation/queries/should-retry-query'
import { categoryKeys } from './category.keys'

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: categoryKeys.list,
    queryFn: getCategoriesUseCase,
    retry: shouldRetryQuery,
  })
