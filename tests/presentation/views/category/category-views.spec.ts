import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Component } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import {
  createCategoryUseCase,
  deleteCategoryUseCase,
  getCategorySummariesUseCase,
  getCategoryUseCase,
  updateCategoryUseCase,
} from '@/composition/category'
import { CategoryEntity, CategorySummaryEntity } from '@/domain/category/entities'
import {
  CategoryHasTransactionsError,
  CategoryNameAlreadyExistsError,
  CategoryNotFoundError,
} from '@/domain/category/errors'
import CategoriesView from '@/presentation/views/category/CategoriesView.vue'
import CreateCategoryView from '@/presentation/views/category/CreateCategoryView.vue'
import EditCategoryView from '@/presentation/views/category/EditCategoryView.vue'

vi.mock('@/composition/category')
vi.mock('vue-sonner', () => ({
  toast: { success: vi.fn<(message: string) => void>(), error: vi.fn<(message: string) => void>() },
}))

const stub = { template: '<div />' }

const summary = (id: string, transactionsCount: number) =>
  new CategorySummaryEntity({
    id,
    name: `Categoria ${id}`,
    description: null,
    transactionsCount,
    totalEntradas: 2500,
    totalSaidas: 89.9,
  })

const category = new CategoryEntity({ id: 'c1', name: 'Fornecedor', description: 'Pagos' })

const settle = async () => {
  await new Promise((resolve) => setTimeout(resolve, 20))
  await flushPromises()
}

const mountView = async (view: Component, props = {}) => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'dashboard', component: stub },
      { path: '/login', name: 'login', component: stub },
      { path: '/categories', name: 'categories', component: stub },
      { path: '/categories/new', name: 'categories-create', component: stub },
      { path: '/categories/:id/edit', name: 'categories-edit', component: stub },
    ],
  })
  await router.push('/categories/new')
  const queryClient = new QueryClient({ defaultOptions: { queries: { retryDelay: 0 } } })
  const wrapper = mount(view, {
    props,
    global: {
      plugins: [pinia, router, [VueQueryPlugin, { queryClient }]],
      stubs: { teleport: true },
    },
  })
  await settle()
  return { wrapper, router }
}

const button = (wrapper: Awaited<ReturnType<typeof mountView>>['wrapper'], text: string) =>
  wrapper.findAll('button').find((b) => b.text() === text)

beforeEach(() => {
  vi.resetAllMocks()
  localStorage.clear()
})

describe('CategoriesView', () => {
  it('muestra el estado vacío', async () => {
    vi.mocked(getCategorySummariesUseCase).mockResolvedValue([])
    const { wrapper } = await mountView(CategoriesView)

    expect(wrapper.text()).toContain('Todavía no tienes categorías')
  })

  it('pinta las filas con el dinero formateado', async () => {
    vi.mocked(getCategorySummariesUseCase).mockResolvedValue([summary('a', 2)])
    const { wrapper } = await mountView(CategoriesView)

    const text = wrapper.text().replace(/\s/g, ' ')
    expect(text).toContain('Categoria a')
    expect(text).toContain('R$ 2.500,00')
    expect(text).toContain('R$ 89,90')
  })

  it('no permite eliminar una categoría con transacciones', async () => {
    vi.mocked(getCategorySummariesUseCase).mockResolvedValue([summary('a', 2)])
    const { wrapper } = await mountView(CategoriesView)

    expect(button(wrapper, 'Eliminar')?.attributes('disabled')).toBeDefined()
  })

  it('elimina solo tras confirmar', async () => {
    vi.mocked(getCategorySummariesUseCase).mockResolvedValue([summary('a', 0)])
    vi.mocked(deleteCategoryUseCase).mockResolvedValue()
    const { wrapper } = await mountView(CategoriesView)

    await button(wrapper, 'Eliminar')?.trigger('click')
    expect(deleteCategoryUseCase).not.toHaveBeenCalled()
    expect(wrapper.find('[role="alertdialog"]').text()).toContain('Categoria a')

    await wrapper.find('[role="alertdialog"] button:last-child').trigger('click')
    await settle()

    expect(vi.mocked(deleteCategoryUseCase).mock.calls[0]?.[0]).toBe('a')
    expect(toast.success).toHaveBeenCalledOnce()
    expect(wrapper.find('[role="alertdialog"]').exists()).toBe(false)
  })

  it('avisa si el backend rechaza la eliminación y refresca la lista', async () => {
    vi.mocked(getCategorySummariesUseCase).mockResolvedValue([summary('a', 0)])
    vi.mocked(deleteCategoryUseCase).mockRejectedValue(new CategoryHasTransactionsError())
    const { wrapper } = await mountView(CategoriesView)

    await button(wrapper, 'Eliminar')?.trigger('click')
    await wrapper.find('[role="alertdialog"] button:last-child').trigger('click')
    await settle()

    expect(toast.error).toHaveBeenCalledWith('No se puede eliminar una categoría con transacciones')
    expect(wrapper.find('[role="alertdialog"]').exists()).toBe(false)
    expect(getCategorySummariesUseCase).toHaveBeenCalledTimes(2)
  })
})

describe('CreateCategoryView', () => {
  it('valida antes de enviar', async () => {
    const { wrapper } = await mountView(CreateCategoryView)

    await wrapper.find('form').trigger('submit')
    await settle()

    expect(wrapper.text()).toContain('Ingresa un nombre')
    expect(createCategoryUseCase).not.toHaveBeenCalled()
  })

  it('crea y vuelve al listado', async () => {
    vi.mocked(createCategoryUseCase).mockResolvedValue(category)
    const { wrapper, router } = await mountView(CreateCategoryView)

    await wrapper.findAll('input')[0]?.setValue('  Fornecedor ')
    await wrapper.find('form').trigger('submit')
    await settle()

    expect(vi.mocked(createCategoryUseCase).mock.calls[0]?.[0]).toEqual({
      name: 'Fornecedor',
      description: '',
    })
    expect(router.currentRoute.value.name).toBe('categories')
  })

  it('marca el nombre repetido en el campo', async () => {
    vi.mocked(createCategoryUseCase).mockRejectedValue(new CategoryNameAlreadyExistsError())
    const { wrapper, router } = await mountView(CreateCategoryView)

    await wrapper.findAll('input')[0]?.setValue('Fornecedor')
    await wrapper.find('form').trigger('submit')
    await settle()

    expect(wrapper.findAll('input')[0]?.attributes('aria-invalid')).toBe('true')
    expect(wrapper.text()).toContain('Ya tienes una categoría con ese nombre')
    expect(router.currentRoute.value.name).toBe('categories-create')
  })
})

describe('EditCategoryView', () => {
  it('carga los datos actuales en el formulario', async () => {
    vi.mocked(getCategoryUseCase).mockResolvedValue(category)
    const { wrapper } = await mountView(EditCategoryView, { id: 'c1' })

    const values = wrapper.findAll<HTMLInputElement>('input').map((input) => input.element.value)
    expect(values).toEqual(['Fornecedor', 'Pagos'])
  })

  it('envía la categoría y lo escrito al caso de uso', async () => {
    vi.mocked(getCategoryUseCase).mockResolvedValue(category)
    vi.mocked(updateCategoryUseCase).mockResolvedValue(category)
    const { wrapper, router } = await mountView(EditCategoryView, { id: 'c1' })

    await wrapper.findAll('input')[0]?.setValue('Otro')
    await wrapper.find('form').trigger('submit')
    await settle()

    const command = vi.mocked(updateCategoryUseCase).mock.calls[0]?.[0]
    expect(command?.category.id).toBe('c1')
    expect(command?.input).toEqual({ name: 'Otro', description: 'Pagos' })
    expect(router.currentRoute.value.name).toBe('categories')
  })

  it('muestra un mensaje si la categoría no existe', async () => {
    vi.mocked(getCategoryUseCase).mockRejectedValue(new CategoryNotFoundError())
    const { wrapper } = await mountView(EditCategoryView, { id: 'abc' })

    expect(wrapper.text()).toContain('La categoría no existe')
    expect(wrapper.find('form').exists()).toBe(false)
  })
})
