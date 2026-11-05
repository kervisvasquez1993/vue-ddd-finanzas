import type { ITransactionRepository } from '@/modules/transaction/domain/repositories'

export const deleteTransactionUseCaseFactory = (repo: ITransactionRepository) => (id: string) =>
  repo.delete(id)
