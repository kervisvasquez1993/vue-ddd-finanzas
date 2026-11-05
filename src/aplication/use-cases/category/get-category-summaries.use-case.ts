import type { ICategoryRepository } from '@/domain/category/repositories'

export const getCategorySummariesUseCaseFactory = (repo: ICategoryRepository) => () =>
  repo.findSummaries()
