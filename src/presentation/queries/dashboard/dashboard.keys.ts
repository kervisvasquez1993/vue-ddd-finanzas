import type { IDashboardFilters } from '@/domain/dashboard/dto'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: (filters: IDashboardFilters) => ['dashboard', 'summary', filters] as const,
}
