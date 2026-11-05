import { authApi } from '@/infrastructure/api/api'
import type { ApiResponse, CategorySummaryResponse } from '@/infrastructure/interfaces'

export const getCategorySummariesAction = async (): Promise<CategorySummaryResponse[]> => {
  const response = await authApi.get<ApiResponse<CategorySummaryResponse[]>>('/categories/summary')
  return response.data
}
