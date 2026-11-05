import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { TransactionCategoryNotFoundError } from '@/modules/transaction/domain/errors'
import type { TransactionEntity } from '@/modules/transaction/domain/entities'
import { useFormErrors } from '@/shared/presentation/composables/use-form-errors'
import {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from '@/modules/transaction/presentation/mutations'
import { useCategoriesQuery } from '@/modules/category'
import { transactionTypedSchema } from '@/modules/transaction/presentation/schemas'
import { today } from '@/shared/presentation/utils/today'

/** Sin `transaction` crea; con `transaction` edita. */
export const useTransactionForm = (transaction?: TransactionEntity) => {
  const router = useRouter()
  const { formErrors, clearFormErrors, handleFormError } = useFormErrors()
  const createMutation = useCreateTransactionMutation()
  const updateMutation = useUpdateTransactionMutation()
  const categoriesQuery = useCategoriesQuery()

  const { defineField, errors, handleSubmit, setFieldError } = useForm({
    validationSchema: transactionTypedSchema,
    initialValues: {
      description: transaction?.description ?? '',
      amount: transaction?.amount,
      type: transaction?.type ?? 'saida',
      date: transaction?.date ?? today(),
      categoryId: transaction?.categoryId ?? '',
    },
  })

  const [description, descriptionAttrs] = defineField('description')
  const [amount, amountAttrs] = defineField('amount')
  const [type, typeAttrs] = defineField('type')
  const [date, dateAttrs] = defineField('date')
  const [categoryId, categoryIdAttrs] = defineField('categoryId')

  const categoryOptions = computed(() =>
    (categoriesQuery.data.value ?? []).map(({ id, name }) => ({ value: id, label: name })),
  )
  const hasNoCategories = computed(
    () => categoriesQuery.isSuccess.value && !categoryOptions.value.length,
  )

  const callbacks = (message: string) => ({
    onSuccess: () => {
      toast.success(message)
      router.push({ name: 'transactions' })
    },
    onError: (error: Error) => {
      if (error instanceof TransactionCategoryNotFoundError) {
        setFieldError('categoryId', error.message)
        return
      }
      handleFormError(error)
    },
  })

  const onSubmit = handleSubmit((input) => {
    clearFormErrors()

    if (transaction) {
      updateMutation.mutate({ transaction, input }, callbacks('Transacción actualizada'))
    } else {
      createMutation.mutate(input, callbacks('Transacción creada'))
    }
  })

  return {
    description,
    descriptionAttrs,
    amount,
    amountAttrs,
    type,
    typeAttrs,
    date,
    dateAttrs,
    categoryId,
    categoryIdAttrs,
    categoryOptions,
    hasNoCategories,
    errors,
    formErrors,
    isPending: transaction ? updateMutation.isPending : createMutation.isPending,
    onSubmit,
  }
}
