import type { ICategoryInput } from '@/domain/category/dto'
import type { ICategoryRepository } from '@/domain/category/repositories'
import { CategoryDescription, CategoryName } from '@/domain/category/value-objects'

export const createCategoryUseCaseFactory =
  (repo: ICategoryRepository) => async (input: ICategoryInput) => {
    const name = CategoryName.create(input.name).toString()
    const description = CategoryDescription.create(input.description).value

    return repo.create({ name, ...(description && { description }) })
  }
