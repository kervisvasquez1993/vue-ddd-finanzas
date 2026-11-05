import { InvalidCategoryError } from '@/modules/category/domain/errors'

const MAX_LENGTH = 255

export class CategoryDescription {
  /** `null` cuando está vacía: el backend guardaría `""` tal cual. */
  readonly value: string | null

  private constructor(value: string | null) {
    this.value = value
  }

  static create(value?: string | null): CategoryDescription {
    const trimmed = value?.trim() ?? ''
    if (trimmed.length > MAX_LENGTH) {
      throw new InvalidCategoryError(`La descripción no puede superar ${MAX_LENGTH} caracteres`)
    }
    return new CategoryDescription(trimmed || null)
  }
}
