import { authApi } from '@/api/api'
import type { ApiResponse } from '@/api/api-response.interface'
import type {
  CategoryResponse,
  UpdateCategoryPayload,
} from '@/modules/category/infrastructure/interfaces'

export const updateCategoryAction = async (
  id: string,
  payload: UpdateCategoryPayload,
): Promise<CategoryResponse> => {
  const response = await authApi.patch<ApiResponse<CategoryResponse>>(`/categories/${id}`, payload)
  return response.data
}
