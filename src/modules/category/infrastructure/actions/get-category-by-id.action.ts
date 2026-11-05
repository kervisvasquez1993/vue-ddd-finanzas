import { authApi } from '@/api/api'
import type { ApiResponse } from '@/api/api-response.interface'
import type { CategoryResponse } from '@/modules/category/infrastructure/interfaces'

export const getCategoryByIdAction = async (id: string): Promise<CategoryResponse> => {
  const response = await authApi.get<ApiResponse<CategoryResponse>>(`/categories/${id}`)
  return response.data
}
