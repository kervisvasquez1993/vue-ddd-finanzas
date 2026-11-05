import { useQuery } from '@tanstack/vue-query'
import { getCategoriesUseCase } from '@/di/category'
import { shouldRetryQuery } from '../should-retry-query'
import { categoryKeys } from './category.keys'

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: categoryKeys.list,
    queryFn: getCategoriesUseCase,
    retry: shouldRetryQuery,
  })
