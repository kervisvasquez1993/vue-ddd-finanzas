import { authApi } from '@/infrastructure/api/api'
import type {
  ApiResponse,
  CategoryResponse,
  CreateCategoryPayload,
} from '@/infrastructure/interfaces'

export const createCategoryAction = async (
  payload: CreateCategoryPayload,
): Promise<CategoryResponse> => {
  const response = await authApi.post<ApiResponse<CategoryResponse>>('/categories', payload)
  return response.data
}
