import type { ITransactionInput } from '@/modules/transaction/domain/dto'
import type { TransactionEntity } from '@/modules/transaction/domain/entities'
import type { ITransactionRepository } from '@/modules/transaction/domain/repositories'

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
