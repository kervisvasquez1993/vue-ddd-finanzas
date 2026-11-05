import { CategoryEntity, CategorySummaryEntity } from '@/domain/category/entities'
import type { CategoryResponse, CategorySummaryResponse } from '@/infrastructure/interfaces'

export class CategoryMapper {
  static toEntity(response: CategoryResponse): CategoryEntity {
    return new CategoryEntity({
      id: response.id,
      name: response.name,
      description: response.description,
    })
  }

  static toSummaryEntity(response: CategorySummaryResponse): CategorySummaryEntity {
    return new CategorySummaryEntity({
      id: response.id,
      name: response.name,
      description: response.description,
      transactionsCount: response.transactionsCount,
      totalEntradas: response.totalEntradas,
      totalSaidas: response.totalSaidas,
    })
  }
}
