import { authApi } from '@/api/api'
import type { ApiResponse } from '@/api/api-response.interface'
import type {
  PaginatedTransactionsResponse,
  TransactionParams,
} from '@/modules/transaction/infrastructure/interfaces'

export const getTransactionsAction = async (
  params: TransactionParams,
): Promise<PaginatedTransactionsResponse> => {
  const response = await authApi.get<ApiResponse<PaginatedTransactionsResponse>>('/transactions', {
    params,
  })
  return response.data
}
