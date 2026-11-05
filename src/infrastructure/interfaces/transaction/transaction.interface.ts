import type { CategoryResponse } from '@/infrastructure/interfaces/category/category.interface'

export interface TransactionResponse {
  id: string
  description: string
  amount: number
  type: 'entrada' | 'saida'
  date: string
  categoryId: string
  category?: CategoryResponse
  userId: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedTransactionsResponse {
  data: TransactionResponse[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface TransactionParams {
  type?: 'entrada' | 'saida'
  categoryId?: string
  startDate?: string
  endDate?: string
  search?: string
  page?: number
  limit?: number
}

export interface CreateTransactionPayload {
  description: string
  amount: number
  type: 'entrada' | 'saida'
  date: string
  categoryId: string
}

export type UpdateTransactionPayload = Partial<Omit<CreateTransactionPayload, 'categoryId'>>
