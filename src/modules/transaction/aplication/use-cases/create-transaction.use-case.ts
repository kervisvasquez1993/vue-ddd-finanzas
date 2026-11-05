import type { ITransactionInput } from '@/modules/transaction/domain/dto'
import type { ITransactionRepository } from '@/modules/transaction/domain/repositories'
import { TransactionDraft } from '@/modules/transaction/domain/value-objects'

export const createTransactionUseCaseFactory =
  (repo: ITransactionRepository) => async (input: ITransactionInput) =>
    repo.create(TransactionDraft.create(input).toRequest())
