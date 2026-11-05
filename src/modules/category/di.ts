import {
  createCategoryUseCaseFactory,
  deleteCategoryUseCaseFactory,
  getCategoriesUseCaseFactory,
  getCategorySummariesUseCaseFactory,
  getCategoryUseCaseFactory,
  updateCategoryUseCaseFactory,
} from '@/modules/category/aplication/use-cases'
import { categoryRepository } from '@/modules/category/infrastructure/repositories'

export const getCategoriesUseCase = getCategoriesUseCaseFactory(categoryRepository)
export const getCategorySummariesUseCase = getCategorySummariesUseCaseFactory(categoryRepository)
export const getCategoryUseCase = getCategoryUseCaseFactory(categoryRepository)
export const createCategoryUseCase = createCategoryUseCaseFactory(categoryRepository)
export const updateCategoryUseCase = updateCategoryUseCaseFactory(categoryRepository)
export const deleteCategoryUseCase = deleteCategoryUseCaseFactory(categoryRepository)
