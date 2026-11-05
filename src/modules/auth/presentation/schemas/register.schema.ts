import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Ingresa tu nombre').max(150, 'Máximo 150 caracteres'),
  email: z
    .string()
    .trim()
    .min(1, 'Ingresa tu email')
    .email('Ingresa un email válido')
    .max(180, 'Máximo 180 caracteres'),
  password: z.string().min(6, 'Mínimo 6 caracteres').max(100, 'Máximo 100 caracteres'),
})

export type RegisterFormInput = z.infer<typeof registerSchema>
export const registerTypedSchema = toTypedSchema(registerSchema)
