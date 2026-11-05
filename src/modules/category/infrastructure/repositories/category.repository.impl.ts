import type { ICreateCategoryRequest, IUpdateCategoryRequest } from '@/modules/category/domain/dto'
import {
  CategoryHasTransactionsError,
  CategoryNameAlreadyExistsError,
  CategoryNotFoundError,
} from '@/modules/category/domain/errors'
import type { ICategoryRepository } from '@/modules/category/domain/repositories'
import {
  createCategoryAction,
  deleteCategoryAction,
  getCategoriesAction,
  getCategoryByIdAction,
  getCategorySummariesAction,
  updateCategoryAction,
} from '@/modules/category/infrastructure/actions'
import { toDomainError } from '@/api/http-error'
import { CategoryMapper } from '@/modules/category/infrastructure/mappers'

const notFound = () => new CategoryNotFoundError()
const nameTaken = () => new CategoryNameAlreadyExistsError()

export class CategoryRepositoryImpl implements ICategoryRepository {
  async findAll() {
    try {
      return (await getCategoriesAction()).map(CategoryMapper.toEntity)
    } catch (error) {
      throw toDomainError(error)
    }
  }

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
