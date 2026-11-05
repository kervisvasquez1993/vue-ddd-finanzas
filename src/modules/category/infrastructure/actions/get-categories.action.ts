import { authApi } from '@/api/api'
import type { ApiResponse } from '@/api/api-response.interface'
import type { CategoryResponse } from '@/modules/category/infrastructure/interfaces'

export const getCategoriesAction = async (): Promise<CategoryResponse[]> => {
  const response = await authApi.get<ApiResponse<CategoryResponse[]>>('/categories')
  return response.data
}
