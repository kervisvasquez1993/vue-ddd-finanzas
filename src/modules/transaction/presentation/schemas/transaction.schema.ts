import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

const TWO_DECIMALS_PATTERN = /^\d+(\.\d{1,2})?$/

export const transactionSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, 'Ingresa una descripción')
    .max(255, 'Máximo 255 caracteres'),
  amount: z.coerce
    .number({ invalid_type_error: 'Ingresa un monto válido' })
    .positive('Ingresa un monto mayor que 0')
    .max(9999999999.99, 'El monto es demasiado alto')
    .refine((value) => TWO_DECIMALS_PATTERN.test(String(value)), 'Usa hasta 2 decimales'),
  type: z.enum(['entrada', 'saida'], { required_error: 'Elige un tipo' }),
  date: z.string().min(1, 'Elige una fecha'),
  categoryId: z.string().min(1, 'Elige una categoría'),
})

export type TransactionFormInput = z.infer<typeof transactionSchema>
export const transactionTypedSchema = toTypedSchema(transactionSchema)
