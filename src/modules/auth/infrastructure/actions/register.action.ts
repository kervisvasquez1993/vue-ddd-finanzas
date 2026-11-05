import { publicApi } from '@/api/api'
import type { ApiResponse } from '@/api/api-response.interface'
import type { RegisterPayload, UserResponse } from '@/modules/auth/infrastructure/interfaces'

export const registerAction = async (payload: RegisterPayload): Promise<UserResponse> => {
  const response = await publicApi.post<ApiResponse<UserResponse>>('/auth/register', payload)
  return response.data
}
