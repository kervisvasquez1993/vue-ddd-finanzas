import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'Ingresa un nombre').max(120, 'Máximo 120 caracteres'),
  description: z.string().trim().max(255, 'Máximo 255 caracteres'),
})

export type CategoryFormInput = z.infer<typeof categorySchema>
export const categoryTypedSchema = toTypedSchema(categorySchema)
