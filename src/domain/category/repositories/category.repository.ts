import type { ICreateCategoryRequest, IUpdateCategoryRequest } from '@/domain/category/dto'
import type { CategoryEntity, CategorySummaryEntity } from '@/domain/category/entities'

export interface ICategoryRepository {
  findSummaries(): Promise<CategorySummaryEntity[]>
  findById(id: string): Promise<CategoryEntity>
  create(data: ICreateCategoryRequest): Promise<CategoryEntity>
  update(id: string, data: IUpdateCategoryRequest): Promise<CategoryEntity>
  delete(id: string): Promise<void>
}
