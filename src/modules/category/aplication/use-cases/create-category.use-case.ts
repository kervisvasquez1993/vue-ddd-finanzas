import type { ICategoryInput } from '@/modules/category/domain/dto'
import type { ICategoryRepository } from '@/modules/category/domain/repositories'
import { CategoryDescription, CategoryName } from '@/modules/category/domain/value-objects'

export const createCategoryUseCaseFactory =
  (repo: ICategoryRepository) => async (input: ICategoryInput) => {
    const name = CategoryName.create(input.name).toString()
    const description = CategoryDescription.create(input.description).value

    return repo.create({ name, ...(description && { description }) })
  }
