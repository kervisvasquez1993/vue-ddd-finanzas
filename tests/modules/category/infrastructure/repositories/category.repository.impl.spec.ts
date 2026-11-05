import { AxiosError, type AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CategoryEntity, CategorySummaryEntity } from '@/modules/category/domain/entities'
import {
  CategoryHasTransactionsError,
  CategoryNameAlreadyExistsError,
  CategoryNotFoundError,
} from '@/modules/category/domain/errors'
import { RequestValidationError, ServiceUnavailableError } from '@/shared/domain/errors'
import {
  createCategoryAction,
  deleteCategoryAction,
  getCategoryByIdAction,
  getCategorySummariesAction,
  updateCategoryAction,
} from '@/modules/category/infrastructure/actions'
import { CategoryRepositoryImpl } from '@/modules/category/infrastructure/repositories'

vi.mock('@/modules/category/infrastructure/actions')

const httpError = (status: number, message: string | string[] = 'x') =>
  new AxiosError('error', undefined, undefined, undefined, {
    status,
    data: { message },
  } as AxiosResponse)

const response = {
  id: 'c1',
  name: 'Fornecedor',
  description: null,
  userId: 'u1',
  createdAt: '2026-11-05T18:49:12.241Z',
  updatedAt: '2026-11-05T18:49:12.241Z',
}

describe('CategoryRepositoryImpl', () => {
  const repo = new CategoryRepositoryImpl()

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('mapea el resumen a entidades', async () => {
    vi.mocked(getCategorySummariesAction).mockResolvedValue([
      { ...response, transactionsCount: 2, totalEntradas: 2500, totalSaidas: 89.9 },
    ])

    const [summary] = await repo.findSummaries()

    expect(summary).toBeInstanceOf(CategorySummaryEntity)
    expect(summary?.totalSaidas).toBe(89.9)
  })

  it('no rompe el listado con un nombre de solo espacios', async () => {
    vi.mocked(getCategorySummariesAction).mockResolvedValue([
      { ...response, name: '   ', transactionsCount: 0, totalEntradas: 0, totalSaidas: 0 },
    ])

    await expect(repo.findSummaries()).resolves.toHaveLength(1)
  })

  it('findById devuelve la entidad', async () => {
    vi.mocked(getCategoryByIdAction).mockResolvedValue(response)

    await expect(repo.findById('c1')).resolves.toBeInstanceOf(CategoryEntity)
  })

  it.each([400, 404])('findById trata el %i como no encontrada', async (status) => {
    vi.mocked(getCategoryByIdAction).mockRejectedValue(httpError(status))

    await expect(repo.findById('abc')).rejects.toBeInstanceOf(CategoryNotFoundError)
  })

  it('el 409 al crear es un nombre repetido', async () => {
    vi.mocked(createCategoryAction).mockRejectedValue(httpError(409))

    await expect(repo.create({ name: 'x' })).rejects.toBeInstanceOf(CategoryNameAlreadyExistsError)
  })

  it('el 409 al editar es un nombre repetido', async () => {
    vi.mocked(updateCategoryAction).mockRejectedValue(httpError(409))

    await expect(repo.update('c1', { name: 'x' })).rejects.toBeInstanceOf(
      CategoryNameAlreadyExistsError,
    )
  })

  it('el 409 al eliminar son transacciones asociadas', async () => {
    vi.mocked(deleteCategoryAction).mockRejectedValue(httpError(409))

    await expect(repo.delete('c1')).rejects.toBeInstanceOf(CategoryHasTransactionsError)
  })

  it('el 404 al eliminar es no encontrada', async () => {
    vi.mocked(deleteCategoryAction).mockRejectedValue(httpError(404))

    await expect(repo.delete('c1')).rejects.toBeInstanceOf(CategoryNotFoundError)
  })

  it('conserva el 400 de validación al crear', async () => {
    vi.mocked(createCategoryAction).mockRejectedValue(httpError(400, ['name should not be empty']))

    await expect(repo.create({ name: 'x' })).rejects.toBeInstanceOf(RequestValidationError)
  })

  it('traduce un 500', async () => {
    vi.mocked(getCategorySummariesAction).mockRejectedValue(httpError(500))

    await expect(repo.findSummaries()).rejects.toBeInstanceOf(ServiceUnavailableError)
  })
})
