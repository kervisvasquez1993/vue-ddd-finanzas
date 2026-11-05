import type { ITransactionInput } from '@/domain/transaction/dto'
import type { TransactionEntity } from '@/domain/transaction/entities'
import type { ITransactionRepository } from '@/domain/transaction/repositories'

export interface UpdateTransactionCommand {
  transaction: TransactionEntity
  input: ITransactionInput
}

export const updateTransactionUseCaseFactory =
  (repo: ITransactionRepository) =>
  async ({ transaction, input }: UpdateTransactionCommand) => {
    const changes = transaction.getChanges(input)

    return Object.keys(changes).length ? repo.update(transaction.id, changes) : transaction
  }
