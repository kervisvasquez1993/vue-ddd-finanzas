import { DateRange } from '@/domain/shared/value-objects'
import type { ITransactionFilters } from '@/domain/transaction/dto'
import type { ITransactionRepository } from '@/domain/transaction/repositories'

export const getTransactionsUseCaseFactory =
  (repo: ITransactionRepository) =>
  async ({ type, categoryId, startDate, endDate, search, page, limit }: ITransactionFilters) => {
    const term = search?.trim()

    // Un filtro vacío como `?type=` responde 400: solo se envían los que tienen valor.
    return repo.findAll({
      ...(type && { type }),
      ...(categoryId && { categoryId }),
      ...DateRange.create({ startDate, endDate }).toParams(),
      ...(term && { search: term }),
      ...(page && { page }),
      ...(limit && { limit }),
    })
  }
