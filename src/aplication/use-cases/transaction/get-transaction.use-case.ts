import type { ITransactionRepository } from '@/domain/transaction/repositories'

export const getTransactionUseCaseFactory = (repo: ITransactionRepository) => (id: string) =>
  repo.findById(id)
