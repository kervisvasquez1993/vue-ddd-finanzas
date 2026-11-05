/** Lo que escribe el usuario, antes de normalizar. */
export interface ICategoryInput {
  name: string
  description?: string | null
}

export interface ICreateCategoryRequest {
  name: string
  description?: string
}

export interface IUpdateCategoryRequest {
  name?: string
  description?: string | null
}
