import type { IDashboardFilters } from '@/modules/dashboard/domain/dto'
import type { IDashboardRepository } from '@/modules/dashboard/domain/repositories'
import { getDashboardAction } from '@/modules/dashboard/infrastructure/actions'
import { toDomainError } from '@/api/http-error'
import { DashboardMapper } from '@/modules/dashboard/infrastructure/mappers'

export class DashboardRepositoryImpl implements IDashboardRepository {
  async getSummary(filters: IDashboardFilters) {
    try {
      return DashboardMapper.toEntity(await getDashboardAction(filters))
    } catch (error) {
      throw toDomainError(error)
    }
  }
}

export const dashboardRepository: IDashboardRepository = new DashboardRepositoryImpl()
