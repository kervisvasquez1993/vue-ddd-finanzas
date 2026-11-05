export type TransactionType = 'entrada' | 'saida'

/** Lo que escribe el usuario, antes de normalizar. */
export interface ITransactionInput {
  description: string
  amount: number
  type: TransactionType
  date: string
  categoryId: string
}

export type ICreateTransactionRequest = ITransactionInput

/** Sin `categoryId`: el backend responde 200 pero no guarda ese cambio. */
export type IUpdateTransactionRequest = Partial<Omit<ITransactionInput, 'categoryId'>>

export interface ITransactionFilters {
  type?: TransactionType
  categoryId?: string
  startDate?: string
  endDate?: string
  search?: string
  page?: number
  limit?: number
}
