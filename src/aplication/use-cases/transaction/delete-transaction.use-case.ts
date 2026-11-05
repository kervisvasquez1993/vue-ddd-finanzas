import type { ITransactionRepository } from '@/domain/transaction/repositories'

export const deleteTransactionUseCaseFactory = (repo: ITransactionRepository) => (id: string) =>
  repo.delete(id)
