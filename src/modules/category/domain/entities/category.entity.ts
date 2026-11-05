import type { ICategoryInput, IUpdateCategoryRequest } from '@/modules/category/domain/dto'
import { CategoryDescription, CategoryName } from '@/modules/category/domain/value-objects'

export interface CategoryEntityProps {
  id: string
  /**
   * Texto plano y no un value object: el backend acepta nombres como `"   "`, y una categoría
   * antigua así no debe romper todo el listado al leerla.
   */
  name: string
  description: string | null
}

export class CategoryEntity {
  private readonly props: CategoryEntityProps

  constructor(props: CategoryEntityProps) {
    this.props = props
  }

  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  /** Solo los campos que cambian: el backend responde 500 ante `{ "name": null }`. */
  getChanges(input: ICategoryInput): IUpdateCategoryRequest {
    const name = CategoryName.create(input.name).toString()
    const description = CategoryDescription.create(input.description).value

    return {
      ...(name !== this.name && { name }),
      ...(description !== this.description && { description }),
    }
  }
}
