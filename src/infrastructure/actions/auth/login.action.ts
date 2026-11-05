import { publicApi } from '@/infrastructure/api/api'
import type { ApiResponse, LoginPayload, LoginResponse } from '@/infrastructure/interfaces'

export const loginAction = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await publicApi.post<ApiResponse<LoginResponse>>('/auth/login', payload)
  return response.data
}
