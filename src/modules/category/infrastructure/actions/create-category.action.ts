import { authApi } from '@/api/api'
import type { ApiResponse } from '@/api/api-response.interface'
import type {
  CategoryResponse,
  CreateCategoryPayload,
} from '@/modules/category/infrastructure/interfaces'

export const createCategoryAction = async (
  payload: CreateCategoryPayload,
): Promise<CategoryResponse> => {
  const response = await authApi.post<ApiResponse<CategoryResponse>>('/categories', payload)
  return response.data
}
