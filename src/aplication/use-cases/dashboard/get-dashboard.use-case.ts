import type { IDashboardFilters } from '@/domain/dashboard/dto'
import type { IDashboardRepository } from '@/domain/dashboard/repositories'
import { DateRange } from '@/domain/shared/value-objects'

export const getDashboardUseCaseFactory =
  (repo: IDashboardRepository) =>
  async (filters: IDashboardFilters = {}) =>
    repo.getSummary(DateRange.create(filters).toParams())
