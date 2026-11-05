import { authApi } from '@/api/api'

export const deleteCategoryAction = async (id: string): Promise<void> => {
  await authApi.delete(`/categories/${id}`)
}
