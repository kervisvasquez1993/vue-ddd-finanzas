export interface CategoryResponse {
  id: string
  name: string
  description: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CategorySummaryResponse {
  id: string
  name: string
  description: string | null
  transactionsCount: number
  totalEntradas: number
  totalSaidas: number
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryPayload {
  name: string
  description?: string
}

export interface UpdateCategoryPayload {
  name?: string
  description?: string | null
}
