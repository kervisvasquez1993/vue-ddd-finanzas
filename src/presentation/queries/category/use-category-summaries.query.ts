import { useQuery } from '@tanstack/vue-query'
import { getCategorySummariesUseCase } from '@/composition/category'
import { shouldRetryQuery } from '../should-retry-query'
import { categoryKeys } from './category.keys'

export const useCategorySummariesQuery = () =>
  useQuery({
    queryKey: categoryKeys.summaries,
    queryFn: getCategorySummariesUseCase,
    retry: shouldRetryQuery,
  })
