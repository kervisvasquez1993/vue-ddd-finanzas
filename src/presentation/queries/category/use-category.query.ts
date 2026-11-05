import { useQuery } from '@tanstack/vue-query'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { getCategoryUseCase } from '@/di/category'
import { shouldRetryQuery } from '../should-retry-query'
import { categoryKeys } from './category.keys'

export const useCategoryQuery = (id: MaybeRefOrGetter<string>) =>
  useQuery({
    queryKey: computed(() => categoryKeys.detail(toValue(id))),
    queryFn: () => getCategoryUseCase(toValue(id)),
    retry: shouldRetryQuery,
  })
