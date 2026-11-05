import { authApi } from '@/infrastructure/api/api'
import type {
  ApiResponse,
  TransactionResponse,
  UpdateTransactionPayload,
} from '@/infrastructure/interfaces'

export const updateTransactionAction = async (
  id: string,
  payload: UpdateTransactionPayload,
): Promise<TransactionResponse> => {
  const response = await authApi.patch<ApiResponse<TransactionResponse>>(
    `/transactions/${id}`,
    payload,
  )
  return response.data
}
