import { authApi } from '@/infrastructure/api/api'

export const deleteTransactionAction = async (id: string): Promise<void> => {
  await authApi.delete(`/transactions/${id}`)
}
