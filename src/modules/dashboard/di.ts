import { getDashboardUseCaseFactory } from '@/modules/dashboard/aplication/use-cases'
import { dashboardRepository } from '@/modules/dashboard/infrastructure/repositories'

export const getDashboardUseCase = getDashboardUseCaseFactory(dashboardRepository)
