import {
  createTransactionUseCaseFactory,
  deleteTransactionUseCaseFactory,
  getTransactionsUseCaseFactory,
  getTransactionUseCaseFactory,
  updateTransactionUseCaseFactory,
} from '@/modules/transaction/aplication/use-cases'
import { transactionRepository } from '@/modules/transaction/infrastructure/repositories'

export const getTransactionsUseCase = getTransactionsUseCaseFactory(transactionRepository)
export const getTransactionUseCase = getTransactionUseCaseFactory(transactionRepository)
export const createTransactionUseCase = createTransactionUseCaseFactory(transactionRepository)
export const updateTransactionUseCase = updateTransactionUseCaseFactory(transactionRepository)
export const deleteTransactionUseCase = deleteTransactionUseCaseFactory(transactionRepository)
