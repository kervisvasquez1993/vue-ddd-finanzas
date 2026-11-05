import type { ICategoryRepository } from '@/modules/category/domain/repositories'

export const deleteCategoryUseCaseFactory = (repo: ICategoryRepository) => (id: string) =>
  repo.delete(id)
