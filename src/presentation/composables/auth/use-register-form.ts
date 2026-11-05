import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useRegisterMutation } from '@/aplication/services/mutation/auth'
import { EmailAlreadyRegisteredError } from '@/domain/auth/errors'
import { useFormErrors } from '@/presentation/composables/shared/use-form-errors'
import { registerTypedSchema } from '@/presentation/schemas/auth'

export const useRegisterForm = () => {
  const router = useRouter()
  const { formErrors, clearFormErrors, handleFormError } = useFormErrors()
  const { mutate, isPending } = useRegisterMutation()

  const { defineField, errors, handleSubmit, setFieldError } = useForm({
    validationSchema: registerTypedSchema,
    initialValues: { name: '', email: '', password: '' },
  })

  const [name, nameAttrs] = defineField('name')
  const [email, emailAttrs] = defineField('email')
  const [password, passwordAttrs] = defineField('password')

  const onSubmit = handleSubmit((values) => {
    clearFormErrors()
    mutate(values, {
      onSuccess: () => {
        toast.success('Cuenta creada. Ya puedes iniciar sesión.')
        router.push({ name: 'login' })
      },
      onError: (error) => {
        if (error instanceof EmailAlreadyRegisteredError) {
          setFieldError('email', error.message)
          return
        }
        handleFormError(error)
      },
    })
  })

  return {
    name,
    nameAttrs,
    email,
    emailAttrs,
    password,
    passwordAttrs,
    errors,
    formErrors,
    isPending,
    onSubmit,
  }
}
