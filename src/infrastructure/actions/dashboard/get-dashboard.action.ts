import { authApi } from '@/infrastructure/api/api'
import type { ApiResponse, DashboardParams, DashboardResponse } from '@/infrastructure/interfaces'

export const getDashboardAction = async (params: DashboardParams): Promise<DashboardResponse> => {
  const response = await authApi.get<ApiResponse<DashboardResponse>>('/dashboard', { params })
  return response.data
}
