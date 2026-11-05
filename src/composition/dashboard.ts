import { getDashboardUseCaseFactory } from '@/aplication/use-cases/dashboard'
import { dashboardRepository } from '@/infrastructure/repositories/dashboard'

export const getDashboardUseCase = getDashboardUseCaseFactory(dashboardRepository)
