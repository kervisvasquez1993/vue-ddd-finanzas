import { CalendarDate } from '@/shared/domain/value-objects'
import type { ICreateTransactionRequest, ITransactionInput } from '@/modules/transaction/domain/dto'
import { InvalidTransactionError } from '@/modules/transaction/domain/errors'

const MAX_DESCRIPTION_LENGTH = 255
const MAX_AMOUNT = 9999999999.99
const TWO_DECIMALS_PATTERN = /^\d+(\.\d{1,2})?$/

/** Los datos de una transacción, normalizados y listos para enviar. */
export class TransactionDraft {
  private readonly props: ICreateTransactionRequest

  private constructor(props: ICreateTransactionRequest) {
    this.props = props
  }

  static create(input: ITransactionInput): TransactionDraft {
    const description = input.description.trim()

    if (!description) throw new InvalidTransactionError('La descripción es obligatoria')
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      throw new InvalidTransactionError(
        `La descripción no puede superar ${MAX_DESCRIPTION_LENGTH} caracteres`,
      )
    }
    if (!(input.amount > 0) || input.amount > MAX_AMOUNT) {
      throw new InvalidTransactionError('El monto debe ser mayor que 0 y menor que el máximo')
    }
    if (!TWO_DECIMALS_PATTERN.test(String(input.amount))) {
      throw new InvalidTransactionError('El monto admite hasta 2 decimales')
    }
    if (input.type !== 'entrada' && input.type !== 'saida') {
      throw new InvalidTransactionError(`Tipo inválido: ${input.type}`)
    }
    if (!input.categoryId) throw new InvalidTransactionError('La categoría es obligatoria')

    return new TransactionDraft({
      description,
      amount: input.amount,
      type: input.type,
      date: CalendarDate.create(input.date).toString(),
      categoryId: input.categoryId,
    })
  }

  toRequest(): ICreateTransactionRequest {
    return { ...this.props }
  }
}
