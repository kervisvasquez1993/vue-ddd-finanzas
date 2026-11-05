import type { ICategoryRepository } from '@/domain/category/repositories'

export const getCategoryUseCaseFactory = (repo: ICategoryRepository) => (id: string) =>
  repo.findById(id)
