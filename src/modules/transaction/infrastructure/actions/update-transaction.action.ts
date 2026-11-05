import { authApi } from '@/api/api'
import type { ApiResponse } from '@/api/api-response.interface'
import type {
  TransactionResponse,
  UpdateTransactionPayload,
} from '@/modules/transaction/infrastructure/interfaces'

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
