import { useForm } from 'vee-validate'
import type { Ref } from 'vue'
import type { IDashboardFilters } from '@/modules/dashboard/domain/dto'
import { periodFilterTypedSchema } from '@/modules/dashboard/presentation/schemas'

export const usePeriodFilterForm = (filters: Ref<IDashboardFilters>) => {
  const { defineField, errors, handleSubmit, resetForm } = useForm({
    validationSchema: periodFilterTypedSchema,
    initialValues: { startDate: '', endDate: '' },
  })

  const [startDate, startDateAttrs] = defineField('startDate')
  const [endDate, endDateAttrs] = defineField('endDate')

  const onSubmit = handleSubmit((values) => {
    filters.value = {
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
    }
  })

  const clear = () => {
    resetForm()
    filters.value = {}
  }

  return { startDate, startDateAttrs, endDate, endDateAttrs, errors, onSubmit, clear }
}
