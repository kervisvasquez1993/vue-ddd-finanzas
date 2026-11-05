import type { ICreateCategoryRequest, IUpdateCategoryRequest } from '@/domain/category/dto'
import {
  CategoryHasTransactionsError,
  CategoryNameAlreadyExistsError,
  CategoryNotFoundError,
} from '@/domain/category/errors'
import type { ICategoryRepository } from '@/domain/category/repositories'
import {
  createCategoryAction,
  deleteCategoryAction,
  getCategoryByIdAction,
  getCategorySummariesAction,
  updateCategoryAction,
} from '@/infrastructure/actions/category'
import { toDomainError } from '@/infrastructure/api/http-error'
import { CategoryMapper } from '@/infrastructure/mappers/category'

const notFound = () => new CategoryNotFoundError()
const nameTaken = () => new CategoryNameAlreadyExistsError()

export class CategoryRepositoryImpl implements ICategoryRepository {
  async findSummaries() {
    try {
      return (await getCategorySummariesAction()).map(CategoryMapper.toSummaryEntity)
    } catch (error) {
      throw toDomainError(error)
    }
  }

  async findById(id: string) {
    try {
      return CategoryMapper.toEntity(await getCategoryByIdAction(id))
    } catch (error) {
      // Un 400 aquí es un :id que no es UUID: para el usuario, esa categoría no existe.
      throw toDomainError(error, { 400: notFound, 404: notFound })
    }
  }

  async create(data: ICreateCategoryRequest) {
    try {
      return CategoryMapper.toEntity(await createCategoryAction(data))
    } catch (error) {
      throw toDomainError(error, { 409: nameTaken })
    }
  }

  async update(id: string, data: IUpdateCategoryRequest) {
    try {
      return CategoryMapper.toEntity(await updateCategoryAction(id, data))
    } catch (error) {
      throw toDomainError(error, { 404: notFound, 409: nameTaken })
    }
  }

  async delete(id: string) {
    try {
      await deleteCategoryAction(id)
    } catch (error) {
      throw toDomainError(error, {
        404: notFound,
        409: () => new CategoryHasTransactionsError(),
      })
    }
  }
}

export const categoryRepository: ICategoryRepository = new CategoryRepositoryImpl()
