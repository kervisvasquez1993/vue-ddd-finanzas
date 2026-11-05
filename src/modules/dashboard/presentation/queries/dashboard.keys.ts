import type { IDashboardFilters } from '@/modules/dashboard/domain/dto'
import { queryRoots } from '@/shared/presentation/queries/query-roots'

export const dashboardKeys = {
  all: queryRoots.dashboard,
  summary: (filters: IDashboardFilters) => [...queryRoots.dashboard, 'summary', filters] as const,
}
