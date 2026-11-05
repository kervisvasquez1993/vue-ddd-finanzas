import type { ICreateCategoryRequest, IUpdateCategoryRequest } from '@/modules/category/domain/dto'
import type { CategoryEntity, CategorySummaryEntity } from '@/modules/category/domain/entities'

export interface ICategoryRepository {
  findAll(): Promise<CategoryEntity[]>
  findSummaries(): Promise<CategorySummaryEntity[]>
  findById(id: string): Promise<CategoryEntity>
  create(data: ICreateCategoryRequest): Promise<CategoryEntity>
  update(id: string, data: IUpdateCategoryRequest): Promise<CategoryEntity>
  delete(id: string): Promise<void>
}
