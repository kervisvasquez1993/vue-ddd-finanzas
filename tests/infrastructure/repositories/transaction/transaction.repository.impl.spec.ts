import { AxiosError, type AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CategoryNotFoundError } from '@/domain/category/errors'
import { ServiceUnavailableError } from '@/domain/shared/errors'
import { TransactionEntity } from '@/domain/transaction/entities'
import { TransactionNotFoundError } from '@/domain/transaction/errors'
import {
  createTransactionAction,
  deleteTransactionAction,
  getTransactionByIdAction,
  getTransactionsAction,
  updateTransactionAction,
} from '@/infrastructure/actions/transaction'
import type { TransactionResponse } from '@/infrastructure/interfaces'
import { TransactionRepositoryImpl } from '@/infrastructure/repositories/transaction'

vi.mock('@/infrastructure/actions/transaction')

const httpError = (status: number) =>
  new AxiosError('error', undefined, undefined, undefined, {
    status,
    data: { message: 'x' },
  } as AxiosResponse)

const response: TransactionResponse = {
  id: 't1',
  description: 'Pago',
  amount: 150.5,
  type: 'saida',
  date: '2026-06-16',
  categoryId: 'c1',
  category: {
    id: 'c1',
    name: 'Fornecedor',
    description: null,
    userId: 'u1',
    createdAt: '2026-11-05T18:49:12.241Z',
    updatedAt: '2026-11-05T18:49:12.241Z',
  },
  userId: 'u1',
  createdAt: '2026-11-05T18:49:12.398Z',
  updatedAt: '2026-11-05T18:49:12.398Z',
}
const draft = {
  description: 'Pago',
  amount: 1,
  type: 'saida' as const,
  date: '2026-06-16',
  categoryId: 'c1',
}

describe('TransactionRepositoryImpl', () => {
  const repo = new TransactionRepositoryImpl()

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('aplana la paginación y mapea las entidades', async () => {
    vi.mocked(getTransactionsAction).mockResolvedValue({
      data: [response],
      meta: { total: 11, page: 2, limit: 10, totalPages: 2 },
    })

    const result = await repo.findAll({ page: 2 })

    expect(result).toMatchObject({ total: 11, page: 2, limit: 10, totalPages: 2 })
    expect(result.items[0]).toBeInstanceOf(TransactionEntity)
    expect(result.items[0]?.categoryName).toBe('Fornecedor')
  })

  it('la respuesta de POST no trae categoría', async () => {
    const { category: _category, ...withoutCategory } = response
    vi.mocked(createTransactionAction).mockResolvedValue(withoutCategory)

    const created = await repo.create(draft)

    expect(created.categoryName).toBeNull()
  })

  it.each([400, 404])('findById trata el %i como no encontrada', async (status) => {
    vi.mocked(getTransactionByIdAction).mockRejectedValue(httpError(status))

    await expect(repo.findById('abc')).rejects.toBeInstanceOf(TransactionNotFoundError)
  })

  it('el 404 al crear es la categoría', async () => {
    vi.mocked(createTransactionAction).mockRejectedValue(httpError(404))

    await expect(repo.create(draft)).rejects.toBeInstanceOf(CategoryNotFoundError)
  })

  it('el 404 al editar es la transacción', async () => {
    vi.mocked(updateTransactionAction).mockRejectedValue(httpError(404))

    await expect(repo.update('t1', { amount: 2 })).rejects.toBeInstanceOf(TransactionNotFoundError)
  })

  it('el 404 al eliminar es la transacción', async () => {
    vi.mocked(deleteTransactionAction).mockRejectedValue(httpError(404))

    await expect(repo.delete('t1')).rejects.toBeInstanceOf(TransactionNotFoundError)
  })

  it('traduce un 500', async () => {
    vi.mocked(getTransactionsAction).mockRejectedValue(httpError(500))

    await expect(repo.findAll({})).rejects.toBeInstanceOf(ServiceUnavailableError)
  })
})
