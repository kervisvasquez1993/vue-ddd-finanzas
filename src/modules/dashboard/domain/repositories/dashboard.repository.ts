import type { IDashboardFilters } from '@/modules/dashboard/domain/dto'
import type { DashboardSummaryEntity } from '@/modules/dashboard/domain/entities'

export interface IDashboardRepository {
  getSummary(filters: IDashboardFilters): Promise<DashboardSummaryEntity>
}
