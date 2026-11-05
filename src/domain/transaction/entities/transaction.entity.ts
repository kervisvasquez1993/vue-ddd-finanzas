import type {
  ITransactionInput,
  IUpdateTransactionRequest,
  TransactionType,
} from '@/domain/transaction/dto'
import { TransactionDraft } from '@/domain/transaction/value-objects'

export interface TransactionEntityProps {
  id: string
  description: string
  amount: number
  type: TransactionType
  date: string
  categoryId: string
  /** `null` en la respuesta de POST, que no incluye la categoría. */
  categoryName: string | null
}

export class TransactionEntity {
  private readonly props: TransactionEntityProps

  constructor(props: TransactionEntityProps) {
    this.props = props
  }

  get id() {
    return this.props.id
  }

  get description() {
    return this.props.description
  }

  get amount() {
    return this.props.amount
  }

  get type() {
    return this.props.type
  }

  get date() {
    return this.props.date
  }

  get categoryId() {
    return this.props.categoryId
  }

  get categoryName() {
    return this.props.categoryName
  }

  isEntrada() {
    return this.props.type === 'entrada'
  }

  /** Solo los campos que cambian. `categoryId` queda fuera: ver `IUpdateTransactionRequest`. */
  getChanges(input: ITransactionInput): IUpdateTransactionRequest {
    const { description, amount, type, date } = TransactionDraft.create(input).toRequest()

    return {
      ...(description !== this.description && { description }),
      ...(amount !== this.amount && { amount }),
      ...(type !== this.type && { type }),
      ...(date !== this.date && { date }),
    }
  }
}
