import { computed } from 'vue'
import { toast } from 'vue-sonner'
import type { CategorySummaryEntity } from '@/modules/category/domain/entities'
import { DomainError } from '@/shared/domain/errors'
import { useConfirmAction } from '@/shared/presentation/composables/use-confirm-action'
import { useDeleteCategoryMutation } from '@/modules/category/presentation/mutations'
import { useCategorySummariesQuery } from '@/modules/category/presentation/queries'

export const useCategoryList = () => {
  const query = useCategorySummariesQuery()
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategoryMutation()

  const {
    target: categoryToDelete,
    isOpen: isDeleteDialogOpen,
    ask: askToDelete,
    close: closeDeleteDialog,
  } = useConfirmAction<CategorySummaryEntity>()

  const errorMessage = computed(() =>
    query.error.value instanceof DomainError
      ? query.error.value.message
      : 'No pudimos cargar las categorías. Inténtalo de nuevo.',
  )

  const confirmDelete = () => {
    if (!categoryToDelete.value) return

    deleteCategory(categoryToDelete.value.id, {
      onSuccess: () => toast.success('Categoría eliminada'),
      onError: (error) =>
        toast.error(error instanceof DomainError ? error.message : 'No pudimos eliminarla'),
      onSettled: closeDeleteDialog,
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
