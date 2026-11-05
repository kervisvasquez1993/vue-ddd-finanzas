import { computed, shallowRef } from 'vue'
import { toast } from 'vue-sonner'
import type { CategorySummaryEntity } from '@/domain/category/entities'
import { DomainError } from '@/domain/shared/errors'
import { useDeleteCategoryMutation } from '@/presentation/mutations/category'
import { useCategorySummariesQuery } from '@/presentation/queries/category'

export const useCategoryList = () => {
  const query = useCategorySummariesQuery()
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategoryMutation()

  const categoryToDelete = shallowRef<CategorySummaryEntity | null>(null)

  // computed con get y set: se puede usar con v-model aunque el estado real sea la categoría.
  const isDeleteDialogOpen = computed({
    get: () => categoryToDelete.value !== null,
    set: (isOpen) => {
      if (!isOpen) categoryToDelete.value = null
    },
  })

  const errorMessage = computed(() =>
    query.error.value instanceof DomainError
      ? query.error.value.message
      : 'No pudimos cargar las categorías. Inténtalo de nuevo.',
  )

  const askToDelete = (category: CategorySummaryEntity) => {
    categoryToDelete.value = category
  }

  const confirmDelete = () => {
    if (!categoryToDelete.value) return

    deleteCategory(categoryToDelete.value.id, {
      onSuccess: () => toast.success('Categoría eliminada'),
      onError: (error) =>
        toast.error(error instanceof DomainError ? error.message : 'No pudimos eliminarla'),
      onSettled: () => {
        categoryToDelete.value = null
      },
    })
  }

  return {
    categories: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage,
    refetch: query.refetch,
    categoryToDelete,
    isDeleteDialogOpen,
    isDeleting,
    askToDelete,
    confirmDelete,
  }
}
