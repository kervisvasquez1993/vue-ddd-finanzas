import type { ITransactionInput } from '@/domain/transaction/dto'
import type { ITransactionRepository } from '@/domain/transaction/repositories'
import { TransactionDraft } from '@/domain/transaction/value-objects'

export const createTransactionUseCaseFactory =
  (repo: ITransactionRepository) => async (input: ITransactionInput) =>
    repo.create(TransactionDraft.create(input).toRequest())
