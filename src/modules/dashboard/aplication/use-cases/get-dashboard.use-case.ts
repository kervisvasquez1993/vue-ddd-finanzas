import type { IDashboardFilters } from '@/modules/dashboard/domain/dto'
import type { IDashboardRepository } from '@/modules/dashboard/domain/repositories'
import { DateRange } from '@/shared/domain/value-objects'

export const getDashboardUseCaseFactory =
  (repo: IDashboardRepository) =>
  async (filters: IDashboardFilters = {}) =>
    repo.getSummary(DateRange.create(filters).toParams())
