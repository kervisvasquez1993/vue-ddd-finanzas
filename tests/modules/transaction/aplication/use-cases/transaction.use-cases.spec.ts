import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createTransactionUseCaseFactory,
  getTransactionsUseCaseFactory,
  updateTransactionUseCaseFactory,
} from '@/modules/transaction/aplication/use-cases'
import { InvalidDateError, InvalidDateRangeError } from '@/shared/domain/errors'
import type { ITransactionInput } from '@/modules/transaction/domain/dto'
import { TransactionEntity } from '@/modules/transaction/domain/entities'
import type { ITransactionRepository } from '@/modules/transaction/domain/repositories'

const input: ITransactionInput = {
  description: 'Pago',
  amount: 10,
  type: 'saida',
  date: '2026-06-16',
  categoryId: 'c1',
}
const transaction = new TransactionEntity({ ...input, id: 't1', categoryName: null })

describe('casos de uso de transacciones', () => {
  const repo = {
    findAll: vi.fn<ITransactionRepository['findAll']>(),
    findById: vi.fn<ITransactionRepository['findById']>(),
    create: vi.fn<ITransactionRepository['create']>(),
    update: vi.fn<ITransactionRepository['update']>(),
    delete: vi.fn<ITransactionRepository['delete']>(),
  }

  beforeEach(() => {
    vi.resetAllMocks()
    repo.create.mockResolvedValue(transaction)
    repo.update.mockResolvedValue(transaction)
  })

  it('el listado omite los filtros sin valor', async () => {
    await getTransactionsUseCaseFactory(repo)({
      startDate: '',
      search: '   ',
      categoryId: undefined,
      page: 2,
      limit: 10,
    })

    expect(repo.findAll).toHaveBeenCalledWith({ page: 2, limit: 10 })
  })

  it('el listado envía los filtros con valor', async () => {
    const filters = {
      type: 'saida' as const,
      categoryId: 'c1',
      startDate: '2026-06-01',
      endDate: '2026-06-30',
      search: 'pago',
      page: 1,
      limit: 10,
    }

    await getTransactionsUseCaseFactory(repo)({ ...filters, search: ' pago ' })

    expect(repo.findAll).toHaveBeenCalledWith(filters)
  })

  it('el listado no consulta con una fecha que no existe', async () => {
    await expect(
      getTransactionsUseCaseFactory(repo)({ startDate: '2026-02-30' }),
    ).rejects.toBeInstanceOf(InvalidDateError)
    expect(repo.findAll).not.toHaveBeenCalled()
  })

  it('el listado no consulta con un rango invertido', async () => {
    await expect(
      getTransactionsUseCaseFactory(repo)({ startDate: '2026-06-30', endDate: '2026-06-01' }),
    ).rejects.toBeInstanceOf(InvalidDateRangeError)
  })

  it('crear normaliza', async () => {
    await createTransactionUseCaseFactory(repo)({ ...input, description: ' Pago ' })

    expect(repo.create).toHaveBeenCalledWith(input)
  })

  it('editar envía solo lo que cambió', async () => {
    await updateTransactionUseCaseFactory(repo)({ transaction, input: { ...input, amount: 20 } })

    expect(repo.update).toHaveBeenCalledWith('t1', { amount: 20 })
  })

  it('editar sin cambios no llama al backend', async () => {
    const result = await updateTransactionUseCaseFactory(repo)({ transaction, input })

    expect(repo.update).not.toHaveBeenCalled()
    expect(result).toBe(transaction)
  })
})
