import { publicApi } from '@/api/api'
import type { ApiResponse } from '@/api/api-response.interface'
import type { LoginPayload, LoginResponse } from '@/modules/auth/infrastructure/interfaces'

export const loginAction = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await publicApi.post<ApiResponse<LoginResponse>>('/auth/login', payload)
  return response.data
}
