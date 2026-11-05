import { CategoryNotFoundError } from '@/domain/category/errors'
import type {
  ICreateTransactionRequest,
  ITransactionFilters,
  IUpdateTransactionRequest,
} from '@/domain/transaction/dto'
import { TransactionNotFoundError } from '@/domain/transaction/errors'
import type { ITransactionRepository } from '@/domain/transaction/repositories'
import {
  createTransactionAction,
  deleteTransactionAction,
  getTransactionByIdAction,
  getTransactionsAction,
  updateTransactionAction,
} from '@/infrastructure/actions/transaction'
import { toDomainError } from '@/infrastructure/api/http-error'
import { TransactionMapper } from '@/infrastructure/mappers/transaction'

const notFound = () => new TransactionNotFoundError()

export class TransactionRepositoryImpl implements ITransactionRepository {
  async findAll(filters: ITransactionFilters) {
    try {
      const { data, meta } = await getTransactionsAction(filters)
      return { ...meta, items: data.map(TransactionMapper.toEntity) }
    } catch (error) {
      throw toDomainError(error)
    }
  }

  async findById(id: string) {
    try {
      return TransactionMapper.toEntity(await getTransactionByIdAction(id))
    } catch (error) {
      // Un 400 aquí es un :id que no es UUID: para el usuario, esa transacción no existe.
      throw toDomainError(error, { 400: notFound, 404: notFound })
    }
  }

  async create(data: ICreateTransactionRequest) {
    try {
      return TransactionMapper.toEntity(await createTransactionAction(data))
    } catch (error) {
      // Al crear, el único 404 posible es el de la categoría.
      throw toDomainError(error, { 404: () => new CategoryNotFoundError() })
    }
  }

  async update(id: string, data: IUpdateTransactionRequest) {
    try {
      return TransactionMapper.toEntity(await updateTransactionAction(id, data))
    } catch (error) {
      throw toDomainError(error, { 404: notFound })
    }
  }

  async delete(id: string) {
    try {
      await deleteTransactionAction(id)
    } catch (error) {
      throw toDomainError(error, { 404: notFound })
    }
  }
}

export const transactionRepository: ITransactionRepository = new TransactionRepositoryImpl()
