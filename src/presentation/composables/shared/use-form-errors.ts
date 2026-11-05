import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { DomainError, RequestValidationError } from '@/domain/shared/errors'

/** Errores generales del formulario. Lo que no es de dominio (500, red) se avisa con un toast. */
export const useFormErrors = () => {
  const formErrors = ref<string[]>([])

  const clearFormErrors = () => {
    formErrors.value = []
  }

  const handleFormError = (error: unknown) => {
    if (error instanceof RequestValidationError) {
      formErrors.value = error.messages
    } else if (error instanceof DomainError) {
      formErrors.value = [error.message]
    } else {
      toast.error('No pudimos completar la operación. Inténtalo de nuevo.')
    }
  }

  return { formErrors, clearFormErrors, handleFormError }
}
