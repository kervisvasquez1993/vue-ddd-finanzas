import {
  createTransactionUseCaseFactory,
  deleteTransactionUseCaseFactory,
  getTransactionsUseCaseFactory,
  getTransactionUseCaseFactory,
  updateTransactionUseCaseFactory,
} from '@/aplication/use-cases/transaction'
import { transactionRepository } from '@/infrastructure/repositories/transaction'

export const getTransactionsUseCase = getTransactionsUseCaseFactory(transactionRepository)
export const getTransactionUseCase = getTransactionUseCaseFactory(transactionRepository)
export const createTransactionUseCase = createTransactionUseCaseFactory(transactionRepository)
export const updateTransactionUseCase = updateTransactionUseCaseFactory(transactionRepository)
export const deleteTransactionUseCase = deleteTransactionUseCaseFactory(transactionRepository)
