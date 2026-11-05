import type { ICategoryRepository } from '@/modules/category/domain/repositories'

export const getCategoriesUseCaseFactory = (repo: ICategoryRepository) => () => repo.findAll()
