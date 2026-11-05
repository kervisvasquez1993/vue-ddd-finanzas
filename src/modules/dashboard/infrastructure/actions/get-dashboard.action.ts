import { authApi } from '@/api/api'
import type { ApiResponse } from '@/api/api-response.interface'
import type {
  DashboardParams,
  DashboardResponse,
} from '@/modules/dashboard/infrastructure/interfaces'

export const getDashboardAction = async (params: DashboardParams): Promise<DashboardResponse> => {
  const response = await authApi.get<ApiResponse<DashboardResponse>>('/dashboard', { params })
  return response.data
}
