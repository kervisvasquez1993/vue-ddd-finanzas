import type { ITransactionRepository } from '@/modules/transaction/domain/repositories'

export const getTransactionUseCaseFactory = (repo: ITransactionRepository) => (id: string) =>
  repo.findById(id)
