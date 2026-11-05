import type { Paginated } from '@/shared/domain/pagination'
import type {
  ICreateTransactionRequest,
  ITransactionFilters,
  IUpdateTransactionRequest,
} from '@/modules/transaction/domain/dto'
import type { TransactionEntity } from '@/modules/transaction/domain/entities'

export interface ITransactionRepository {
  findAll(filters: ITransactionFilters): Promise<Paginated<TransactionEntity>>
  findById(id: string): Promise<TransactionEntity>
  create(data: ICreateTransactionRequest): Promise<TransactionEntity>
  update(id: string, data: IUpdateTransactionRequest): Promise<TransactionEntity>
  delete(id: string): Promise<void>
}
