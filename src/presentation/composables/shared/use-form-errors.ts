import { ref } from 'vue'
import { toast } from 'vue-sonner'
import {
  DomainError,
  RequestValidationError,
  ServiceUnavailableError,
} from '@/domain/shared/errors'

const GENERIC_ERROR = 'No pudimos completar la operación. Inténtalo de nuevo.'

/** Errores generales del formulario. Lo que no depende de lo escrito se avisa con un toast. */
export const useFormErrors = () => {
  const formErrors = ref<string[]>([])

  const clearFormErrors = () => {
    formErrors.value = []
  }

  const handleFormError = (error: unknown) => {
    if (error instanceof RequestValidationError) {
      formErrors.value = error.messages
    } else if (error instanceof DomainError && !(error instanceof ServiceUnavailableError)) {
      formErrors.value = [error.message]
    } else {
      toast.error(GENERIC_ERROR)
    }
  }

  return { formErrors, clearFormErrors, handleFormError }
}
