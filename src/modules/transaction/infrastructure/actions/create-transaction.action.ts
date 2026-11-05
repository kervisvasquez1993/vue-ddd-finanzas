import { authApi } from '@/api/api'
import type { ApiResponse } from '@/api/api-response.interface'
import type {
  CreateTransactionPayload,
  TransactionResponse,
} from '@/modules/transaction/infrastructure/interfaces'

export const createTransactionAction = async (
  payload: CreateTransactionPayload,
): Promise<TransactionResponse> => {
  const response = await authApi.post<ApiResponse<TransactionResponse>>('/transactions', payload)
  return response.data
}
