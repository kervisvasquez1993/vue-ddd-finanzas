import type { ICategoryRepository } from '@/domain/category/repositories'

export const getCategoriesUseCaseFactory = (repo: ICategoryRepository) => () => repo.findAll()
