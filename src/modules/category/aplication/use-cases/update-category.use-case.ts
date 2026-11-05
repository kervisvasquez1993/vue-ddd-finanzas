import type { ICategoryInput } from '@/modules/category/domain/dto'
import type { CategoryEntity } from '@/modules/category/domain/entities'
import type { ICategoryRepository } from '@/modules/category/domain/repositories'

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
