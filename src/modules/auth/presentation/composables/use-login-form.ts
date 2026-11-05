import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

import { useFormErrors } from '@/shared/presentation/composables/use-form-errors'
import { loginTypedSchema } from '@/modules/auth/presentation/schemas'
import { useAuthStore } from '@/modules/auth/presentation/stores/auth.store'
import { useLoginMutation } from '@/modules/auth/presentation/mutations/use-login.mutation'

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
