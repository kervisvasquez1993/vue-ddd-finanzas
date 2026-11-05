import type { ICategoryRepository } from '@/modules/category/domain/repositories'

export const getCategorySummariesUseCaseFactory = (repo: ICategoryRepository) => () =>
  repo.findSummaries()
