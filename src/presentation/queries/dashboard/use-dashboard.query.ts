import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { getDashboardUseCase } from '@/composition/dashboard'
import type { IDashboardFilters } from '@/domain/dashboard/dto'
import { shouldRetryQuery } from '../should-retry-query'
import { dashboardKeys } from './dashboard.keys'

export const useDashboardQuery = (filters: MaybeRefOrGetter<IDashboardFilters>) =>
  useQuery({
    queryKey: computed(() => dashboardKeys.summary(toValue(filters))),
    queryFn: () => getDashboardUseCase(toValue(filters)),
    placeholderData: keepPreviousData,
    retry: shouldRetryQuery,
  })
