import type { ICategoryRepository } from '@/modules/category/domain/repositories'

export const getCategoryUseCaseFactory = (repo: ICategoryRepository) => (id: string) =>
  repo.findById(id)
