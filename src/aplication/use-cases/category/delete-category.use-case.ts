import type { ICategoryRepository } from '@/domain/category/repositories'

export const deleteCategoryUseCaseFactory = (repo: ICategoryRepository) => (id: string) =>
  repo.delete(id)
