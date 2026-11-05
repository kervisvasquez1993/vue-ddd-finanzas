import { useQuery } from '@tanstack/vue-query'
import { getCategorySummariesUseCase } from '@/modules/category/di'
import { shouldRetryQuery } from '@/shared/presentation/queries/should-retry-query'
import { categoryKeys } from './category.keys'

export const useCategorySummariesQuery = () =>
  useQuery({
    queryKey: categoryKeys.summaries,
    queryFn: getCategorySummariesUseCase,
    retry: shouldRetryQuery,
  })
