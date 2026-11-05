import { TransactionEntity } from '@/domain/transaction/entities'
import type { TransactionResponse } from '@/infrastructure/interfaces'

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
