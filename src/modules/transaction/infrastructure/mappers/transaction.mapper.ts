import { TransactionEntity } from '@/modules/transaction/domain/entities'
import type { TransactionResponse } from '@/modules/transaction/infrastructure/interfaces'

export class TransactionMapper {
  static toEntity(response: TransactionResponse): TransactionEntity {
    return new TransactionEntity({
      id: response.id,
      description: response.description,
      amount: response.amount,
      type: response.type,
      date: response.date,
      categoryId: response.categoryId,
      categoryName: response.category?.name ?? null,
    })
  }
}
