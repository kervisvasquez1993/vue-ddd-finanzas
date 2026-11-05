import { authApi } from '@/infrastructure/api/api'
import type { ApiResponse, CategoryResponse } from '@/infrastructure/interfaces'

export const getCategoriesAction = async (): Promise<CategoryResponse[]> => {
  const response = await authApi.get<ApiResponse<CategoryResponse[]>>('/categories')
  return response.data
}
