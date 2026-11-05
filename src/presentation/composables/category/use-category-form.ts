import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { CategoryNameAlreadyExistsError } from '@/domain/category/errors'
import type { CategoryEntity } from '@/domain/category/entities'
import { useFormErrors } from '@/presentation/composables/shared/use-form-errors'
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from '@/presentation/mutations/category'
import { categoryTypedSchema } from '@/presentation/schemas/category'

/** Sin `category` crea; con `category` edita. */
export const useCategoryForm = (category?: CategoryEntity) => {
  const router = useRouter()
  const { formErrors, clearFormErrors, handleFormError } = useFormErrors()
  const createMutation = useCreateCategoryMutation()
  const updateMutation = useUpdateCategoryMutation()

  const { defineField, errors, handleSubmit, setFieldError } = useForm({
    validationSchema: categoryTypedSchema,
    initialValues: { name: category?.name ?? '', description: category?.description ?? '' },
  })

  const [name, nameAttrs] = defineField('name')
  const [description, descriptionAttrs] = defineField('description')

  const callbacks = (message: string) => ({
    onSuccess: () => {
      toast.success(message)
      router.push({ name: 'categories' })
    },
    onError: (error: Error) => {
      if (error instanceof CategoryNameAlreadyExistsError) {
        setFieldError('name', error.message)
        return
      }
      handleFormError(error)
    },
  })

  const onSubmit = handleSubmit((input) => {
    clearFormErrors()

    if (category) {
      updateMutation.mutate({ category, input }, callbacks('Categoría actualizada'))
    } else {
      createMutation.mutate(input, callbacks('Categoría creada'))
    }
  })

  return {
    name,
    nameAttrs,
    description,
    descriptionAttrs,
    errors,
    formErrors,
    isPending: category ? updateMutation.isPending : createMutation.isPending,
    onSubmit,
  }
}
