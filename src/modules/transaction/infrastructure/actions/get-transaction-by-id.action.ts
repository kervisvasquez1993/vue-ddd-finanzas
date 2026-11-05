import { authApi } from '@/api/api'
import type { ApiResponse } from '@/api/api-response.interface'
import type { TransactionResponse } from '@/modules/transaction/infrastructure/interfaces'

export const getTransactionByIdAction = async (id: string): Promise<TransactionResponse> => {
  const response = await authApi.get<ApiResponse<TransactionResponse>>(`/transactions/${id}`)
  return response.data
}
