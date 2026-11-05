import { publicApi } from '@/infrastructure/api/api'
import type { ApiResponse, RegisterPayload, UserResponse } from '@/infrastructure/interfaces'

export const registerAction = async (payload: RegisterPayload): Promise<UserResponse> => {
  const response = await publicApi.post<ApiResponse<UserResponse>>('/auth/register', payload)
  return response.data
}
