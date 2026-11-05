import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { CategoryNameAlreadyExistsError } from '@/modules/category/domain/errors'
import type { CategoryEntity } from '@/modules/category/domain/entities'
import { useFormErrors } from '@/shared/presentation/composables/use-form-errors'
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from '@/modules/category/presentation/mutations'
import { categoryTypedSchema } from '@/modules/category/presentation/schemas'

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
