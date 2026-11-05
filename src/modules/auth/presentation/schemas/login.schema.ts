import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Ingresa tu email').email('Ingresa un email válido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

export type LoginFormInput = z.infer<typeof loginSchema>
export const loginTypedSchema = toTypedSchema(loginSchema)
