import type { IDashboardFilters } from '@/domain/dashboard/dto'
import type { IDashboardRepository } from '@/domain/dashboard/repositories'
import { getDashboardAction } from '@/infrastructure/actions/dashboard'
import { toDomainError } from '@/infrastructure/api/http-error'
import { DashboardMapper } from '@/infrastructure/mappers/dashboard'

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
