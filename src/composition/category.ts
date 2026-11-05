import {
  createCategoryUseCaseFactory,
  deleteCategoryUseCaseFactory,
  getCategorySummariesUseCaseFactory,
  getCategoryUseCaseFactory,
  updateCategoryUseCaseFactory,
} from '@/aplication/use-cases/category'
import { categoryRepository } from '@/infrastructure/repositories/category'

export const getCategorySummariesUseCase = getCategorySummariesUseCaseFactory(categoryRepository)
export const getCategoryUseCase = getCategoryUseCaseFactory(categoryRepository)
export const createCategoryUseCase = createCategoryUseCaseFactory(categoryRepository)
export const updateCategoryUseCase = updateCategoryUseCaseFactory(categoryRepository)
export const deleteCategoryUseCase = deleteCategoryUseCaseFactory(categoryRepository)
