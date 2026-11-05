import { authApi } from '@/infrastructure/api/api'
import type {
  ApiResponse,
  PaginatedTransactionsResponse,
  TransactionParams,
} from '@/infrastructure/interfaces'

export const getTransactionsAction = async (
  params: TransactionParams,
): Promise<PaginatedTransactionsResponse> => {
  const response = await authApi.get<ApiResponse<PaginatedTransactionsResponse>>('/transactions', {
    params,
  })
  return response.data
}
