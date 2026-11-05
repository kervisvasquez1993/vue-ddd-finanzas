import type { TransactionType } from '@/modules/transaction/domain/dto'
import type { SelectOption } from '@/shared/presentation/components/form.types'

export const transactionTypeLabels: Record<TransactionType, string> = {
  entrada: 'Entrada',
  saida: 'Salida',
}

export const transactionTypeOptions: SelectOption[] = [
  { value: 'entrada', label: transactionTypeLabels.entrada },
  { value: 'saida', label: transactionTypeLabels.saida },
]
