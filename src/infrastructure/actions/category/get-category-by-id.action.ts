import { authApi } from '@/infrastructure/api/api'
import type { ApiResponse, CategoryResponse } from '@/infrastructure/interfaces'

export const getCategoryByIdAction = async (id: string): Promise<CategoryResponse> => {
  const response = await authApi.get<ApiResponse<CategoryResponse>>(`/categories/${id}`)
  return response.data
}
