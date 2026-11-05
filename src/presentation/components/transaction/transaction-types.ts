import type { TransactionType } from '@/domain/transaction/dto'
import type { SelectOption } from '@/presentation/components/shared/form.types'

export const transactionTypeLabels: Record<TransactionType, string> = {
  entrada: 'Entrada',
  saida: 'Salida',
}

export const transactionTypeOptions: SelectOption[] = [
  { value: 'entrada', label: transactionTypeLabels.entrada },
  { value: 'saida', label: transactionTypeLabels.saida },
]
