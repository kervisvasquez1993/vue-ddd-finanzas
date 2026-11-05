import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createCategoryUseCaseFactory,
  updateCategoryUseCaseFactory,
} from '@/aplication/use-cases/category'
import { CategoryEntity } from '@/domain/category/entities'
import { InvalidCategoryError } from '@/domain/category/errors'
import type { ICategoryRepository } from '@/domain/category/repositories'

const category = new CategoryEntity({ id: 'c1', name: 'Fornecedor', description: null })

describe('casos de uso de categorías', () => {
  const repo = {
    findAll: vi.fn<ICategoryRepository['findAll']>(),
    findSummaries: vi.fn<ICategoryRepository['findSummaries']>(),
    findById: vi.fn<ICategoryRepository['findById']>(),
    create: vi.fn<ICategoryRepository['create']>(),
    update: vi.fn<ICategoryRepository['update']>(),
    delete: vi.fn<ICategoryRepository['delete']>(),
  }

  beforeEach(() => {
    vi.resetAllMocks()
    repo.create.mockResolvedValue(category)
    repo.update.mockResolvedValue(category)
  })

  it('crear normaliza y omite la descripción vacía', async () => {
    await createCategoryUseCaseFactory(repo)({ name: ' Fornecedor ', description: '  ' })

    expect(repo.create).toHaveBeenCalledWith({ name: 'Fornecedor' })
  })

  it('crear envía la descripción cuando existe', async () => {
    await createCategoryUseCaseFactory(repo)({ name: 'Fornecedor', description: ' Pagos ' })

    expect(repo.create).toHaveBeenCalledWith({ name: 'Fornecedor', description: 'Pagos' })
  })

  it('crear rechaza un nombre vacío sin llamar al backend', async () => {
    await expect(createCategoryUseCaseFactory(repo)({ name: '   ' })).rejects.toBeInstanceOf(
      InvalidCategoryError,
    )
    expect(repo.create).not.toHaveBeenCalled()
  })

  it('editar envía solo lo que cambió', async () => {
    await updateCategoryUseCaseFactory(repo)({
      category,
      input: { name: 'Fornecedor', description: 'Nueva' },
    })

    expect(repo.update).toHaveBeenCalledWith('c1', { description: 'Nueva' })
  })

  it('editar sin cambios no llama al backend', async () => {
    const result = await updateCategoryUseCaseFactory(repo)({
      category,
      input: { name: 'Fornecedor', description: '' },
    })

    expect(repo.update).not.toHaveBeenCalled()
    expect(result).toBe(category)
  })
})
