import { authApi } from '@/infrastructure/api/api'
import type {
  ApiResponse,
  CategoryResponse,
  UpdateCategoryPayload,
} from '@/infrastructure/interfaces'

export const updateCategoryAction = async (
  id: string,
  payload: UpdateCategoryPayload,
): Promise<CategoryResponse> => {
  const response = await authApi.patch<ApiResponse<CategoryResponse>>(`/categories/${id}`, payload)
  return response.data
}
