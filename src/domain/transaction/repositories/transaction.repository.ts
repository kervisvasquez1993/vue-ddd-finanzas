import type { Paginated } from '@/domain/shared/pagination'
import type {
  ICreateTransactionRequest,
  ITransactionFilters,
  IUpdateTransactionRequest,
} from '@/domain/transaction/dto'
import type { TransactionEntity } from '@/domain/transaction/entities'

export interface ITransactionRepository {
  findAll(filters: ITransactionFilters): Promise<Paginated<TransactionEntity>>
  findById(id: string): Promise<TransactionEntity>
  create(data: ICreateTransactionRequest): Promise<TransactionEntity>
  update(id: string, data: IUpdateTransactionRequest): Promise<TransactionEntity>
  delete(id: string): Promise<void>
}
