import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export const periodFilterSchema = z
  .object({ startDate: z.string(), endDate: z.string() })
  .refine(({ startDate, endDate }) => !startDate || !endDate || startDate <= endDate, {
    message: 'Debe ser igual o posterior a la fecha inicial',
    path: ['endDate'],
  })

export type PeriodFilterInput = z.infer<typeof periodFilterSchema>
export const periodFilterTypedSchema = toTypedSchema(periodFilterSchema)
