import type { IDashboardFilters } from '@/domain/dashboard/dto'
import type { DashboardSummaryEntity } from '@/domain/dashboard/entities'

export interface IDashboardRepository {
  getSummary(filters: IDashboardFilters): Promise<DashboardSummaryEntity>
}
