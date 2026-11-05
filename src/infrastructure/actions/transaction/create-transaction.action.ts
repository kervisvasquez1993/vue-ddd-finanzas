import { authApi } from '@/infrastructure/api/api'
import type {
  ApiResponse,
  CreateTransactionPayload,
  TransactionResponse,
} from '@/infrastructure/interfaces'

export const createTransactionAction = async (
  payload: CreateTransactionPayload,
): Promise<TransactionResponse> => {
  const response = await authApi.post<ApiResponse<TransactionResponse>>('/transactions', payload)
  return response.data
}
