import { authApi } from '@/infrastructure/api/api'
import type { ApiResponse, TransactionResponse } from '@/infrastructure/interfaces'

export const getTransactionByIdAction = async (id: string): Promise<TransactionResponse> => {
  const response = await authApi.get<ApiResponse<TransactionResponse>>(`/transactions/${id}`)
  return response.data
}
