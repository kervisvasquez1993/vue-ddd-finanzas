import type { ICategoryInput } from '@/domain/category/dto'
import type { CategoryEntity } from '@/domain/category/entities'
import type { ICategoryRepository } from '@/domain/category/repositories'

export interface UpdateCategoryCommand {
  category: CategoryEntity
  input: ICategoryInput
}

export const updateCategoryUseCaseFactory =
  (repo: ICategoryRepository) =>
  async ({ category, input }: UpdateCategoryCommand) => {
    const changes = category.getChanges(input)

    return Object.keys(changes).length ? repo.update(category.id, changes) : category
  }
