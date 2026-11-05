import { authApi } from '@/api/api'
import type { ApiResponse } from '@/api/api-response.interface'
import type { CategorySummaryResponse } from '@/modules/category/infrastructure/interfaces'

export const getCategorySummariesAction = async (): Promise<CategorySummaryResponse[]> => {
  const response = await authApi.get<ApiResponse<CategorySummaryResponse[]>>('/categories/summary')
  return response.data
}
