import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

import { useFormErrors } from '@/presentation/composables/shared/use-form-errors'
import { loginTypedSchema } from '@/presentation/schemas/auth'
import { useAuthStore } from '@/presentation/stores/auth.store'
import { useLoginMutation } from '@/presentation/mutations/auth/use-login.mutation'

export const useLoginForm = () => {
  const router = useRouter()
  const authStore = useAuthStore()
  const { formErrors, clearFormErrors, handleFormError } = useFormErrors()
  const { mutate, isPending } = useLoginMutation()

  const { defineField, errors, handleSubmit } = useForm({
    validationSchema: loginTypedSchema,
    initialValues: { email: '', password: '' },
  })

  const [email, emailAttrs] = defineField('email')
  const [password, passwordAttrs] = defineField('password')

  const onSubmit = handleSubmit((values) => {
    clearFormErrors()
    mutate(values, {
      onSuccess: (session) => {
        authStore.setSession(session)
        router.push({ name: 'dashboard' })
      },
      onError: handleFormError,
    })
  })

  return { email, emailAttrs, password, passwordAttrs, errors, formErrors, isPending, onSubmit }
}
