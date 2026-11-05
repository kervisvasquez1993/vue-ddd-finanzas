import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Component } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { getCategoriesUseCase } from '@/di/category'
import {
  createTransactionUseCase,
  deleteTransactionUseCase,
  getTransactionsUseCase,
  getTransactionUseCase,
  updateTransactionUseCase,
} from '@/di/transaction'
import { CategoryEntity } from '@/domain/category/entities'
import { CategoryNotFoundError } from '@/domain/category/errors'
import type { Paginated } from '@/domain/shared/pagination'
import { TransactionEntity } from '@/domain/transaction/entities'
import { TransactionNotFoundError } from '@/domain/transaction/errors'
import CreateTransactionView from '@/presentation/views/transaction/CreateTransactionView.vue'
import EditTransactionView from '@/presentation/views/transaction/EditTransactionView.vue'
import TransactionsView from '@/presentation/views/transaction/TransactionsView.vue'

vi.mock('@/di/transaction')
vi.mock('@/di/category')
vi.mock('vue-sonner', () => ({
  toast: { success: vi.fn<(message: string) => void>(), error: vi.fn<(message: string) => void>() },
}))

const stub = { template: '<div />' }

const transaction = new TransactionEntity({
  id: 't1',
  description: 'Pago proveedor',
  amount: 150.5,
  type: 'saida',
  date: '2026-06-16',
  categoryId: 'c1',
  categoryName: 'Fornecedor',
})
const category = new CategoryEntity({ id: 'c1', name: 'Fornecedor', description: null })

const page = (overrides: Partial<Paginated<TransactionEntity>> = {}) => ({
  items: [transaction],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
  ...overrides,
})

const settle = async () => {
  await new Promise((resolve) => setTimeout(resolve, 20))
  await flushPromises()
}

const mountView = async (view: Component, { props = {}, path = '/transactions' } = {}) => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'dashboard', component: stub },
      { path: '/login', name: 'login', component: stub },
      { path: '/categories', name: 'categories', component: stub },
      { path: '/categories/new', name: 'categories-create', component: stub },
      { path: '/transactions', name: 'transactions', component: stub },
      { path: '/transactions/new', name: 'transactions-create', component: stub },
      { path: '/transactions/:id/edit', name: 'transactions-edit', component: stub },
    ],
  })
  await router.push(path)
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

type Wrapper = Awaited<ReturnType<typeof mountView>>['wrapper']

const button = (wrapper: Wrapper, text: string) =>
  wrapper.findAll('button').find((b) => b.text() === text)

const lastFilters = () => vi.mocked(getTransactionsUseCase).mock.lastCall?.[0]

beforeEach(() => {
  vi.resetAllMocks()
  localStorage.clear()
  vi.mocked(getCategoriesUseCase).mockResolvedValue([category])
})

describe('TransactionsView', () => {
  it('pinta las filas con fecha, categoría, tipo y monto', async () => {
    vi.mocked(getTransactionsUseCase).mockResolvedValue(page())
    const { wrapper } = await mountView(TransactionsView)

    const text = wrapper.text().replace(/\s/g, ' ')
    expect(text).toContain('16/06/2026')
    expect(text).toContain('Fornecedor')
    expect(text).toContain('Salida')
    expect(text).toContain('- R$ 150,50')
  })

  it('lee los filtros de la URL', async () => {
    vi.mocked(getTransactionsUseCase).mockResolvedValue(page())
    await mountView(TransactionsView, { path: '/transactions?type=saida&categoryId=c1&page=3' })

    expect(lastFilters()).toMatchObject({ type: 'saida', categoryId: 'c1', page: 3, limit: 10 })
  })

  it('ignora valores inválidos en la URL', async () => {
    vi.mocked(getTransactionsUseCase).mockResolvedValue(page())
    await mountView(TransactionsView, { path: '/transactions?type=otro&page=abc' })

    expect(lastFilters()).toMatchObject({ type: undefined, page: 1 })
  })

  it('cambiar un filtro actualiza la URL y vuelve a la página 1', async () => {
    vi.mocked(getTransactionsUseCase).mockResolvedValue(page({ totalPages: 3, page: 2 }))
    const { wrapper, router } = await mountView(TransactionsView, {
      path: '/transactions?page=2',
    })

    await wrapper.findAll('select')[0]?.setValue('entrada')
    await settle()

    expect(router.currentRoute.value.query).toEqual({ type: 'entrada' })
    expect(lastFilters()).toMatchObject({ type: 'entrada', page: 1 })
  })

  it('la búsqueda espera a que se deje de escribir', async () => {
    vi.mocked(getTransactionsUseCase).mockResolvedValue(page())
    const { wrapper, router } = await mountView(TransactionsView)
    const input = wrapper.find('input[type="search"]')

    await input.setValue('pa')
    await input.setValue('pago')
    await settle()
    expect(router.currentRoute.value.query.search).toBeUndefined()

    await vi.waitFor(() => expect(router.currentRoute.value.query.search).toBe('pago'))
    await vi.waitFor(() => expect(lastFilters()).toMatchObject({ search: 'pago', page: 1 }))
  })

  it('pagina con los botones', async () => {
    vi.mocked(getTransactionsUseCase).mockResolvedValue(page({ total: 25, totalPages: 3 }))
    const { wrapper, router } = await mountView(TransactionsView)

    expect(button(wrapper, 'Anterior')?.attributes('disabled')).toBeDefined()

    await button(wrapper, 'Siguiente')?.trigger('click')
    await settle()

    expect(router.currentRoute.value.query.page).toBe('2')
  })

  it('vuelve a la última página si la actual quedó fuera de rango', async () => {
    vi.mocked(getTransactionsUseCase).mockResolvedValue(
      page({ items: [], page: 3, totalPages: 2, total: 10 }),
    )
    const { router } = await mountView(TransactionsView, { path: '/transactions?page=3' })

    expect(router.currentRoute.value.query.page).toBe('2')
  })

  it('distingue el vacío total del vacío por filtros', async () => {
    vi.mocked(getTransactionsUseCase).mockResolvedValue(page({ items: [], total: 0 }))

    const sinFiltros = await mountView(TransactionsView)
    expect(sinFiltros.wrapper.text()).toContain('Todavía no tienes transacciones')

    const conFiltros = await mountView(TransactionsView, { path: '/transactions?type=saida' })
    expect(conFiltros.wrapper.text()).toContain('No hay transacciones con estos filtros')
  })

  it('limpiar quita todos los filtros', async () => {
    vi.mocked(getTransactionsUseCase).mockResolvedValue(page())
    const { wrapper, router } = await mountView(TransactionsView, {
      path: '/transactions?type=saida&search=pago&page=2',
    })

    await button(wrapper, 'Limpiar filtros')?.trigger('click')
    await settle()

    expect(router.currentRoute.value.query).toEqual({})
    expect((wrapper.find('input[type="search"]').element as HTMLInputElement).value).toBe('')
  })

  it('elimina solo tras confirmar y refresca la lista', async () => {
    vi.mocked(getTransactionsUseCase).mockResolvedValue(page())
    vi.mocked(deleteTransactionUseCase).mockResolvedValue()
    const { wrapper } = await mountView(TransactionsView)

    await button(wrapper, 'Eliminar')?.trigger('click')
    expect(deleteTransactionUseCase).not.toHaveBeenCalled()

    await wrapper.find('[role="alertdialog"] button:last-child').trigger('click')
    await settle()

    expect(vi.mocked(deleteTransactionUseCase).mock.calls[0]?.[0]).toBe('t1')
    expect(toast.success).toHaveBeenCalledOnce()
    expect(getTransactionsUseCase).toHaveBeenCalledTimes(2)
  })
})

describe('CreateTransactionView', () => {
  const fill = async (wrapper: Wrapper) => {
    await wrapper.find('input:not([type])').setValue('Pago')
    await wrapper.find('input[type="number"]').setValue('150.55')
    await wrapper.findAll('select')[1]?.setValue('c1')
  }

  it('valida antes de enviar', async () => {
    const { wrapper } = await mountView(CreateTransactionView)

    await wrapper.find('form').trigger('submit')
    await settle()

    expect(wrapper.text()).toContain('Ingresa una descripción')
    expect(wrapper.text()).toContain('Elige una categoría')
    expect(createTransactionUseCase).not.toHaveBeenCalled()
  })

  it('rechaza más de 2 decimales', async () => {
    const { wrapper } = await mountView(CreateTransactionView)

    await fill(wrapper)
    await wrapper.find('input[type="number"]').setValue('10.123')
    await wrapper.find('form').trigger('submit')
    await settle()

    expect(wrapper.text()).toContain('Usa hasta 2 decimales')
    expect(createTransactionUseCase).not.toHaveBeenCalled()
  })

  it('crea con la fecha de hoy por defecto y vuelve al listado', async () => {
    vi.mocked(createTransactionUseCase).mockResolvedValue(transaction)
    const { wrapper, router } = await mountView(CreateTransactionView, {
      path: '/transactions/new',
    })

    await fill(wrapper)
    await wrapper.find('form').trigger('submit')
    await settle()

    const input = vi.mocked(createTransactionUseCase).mock.calls[0]?.[0]
    expect(input).toMatchObject({
      description: 'Pago',
      amount: 150.55,
      type: 'saida',
      categoryId: 'c1',
    })
    expect(input?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(router.currentRoute.value.name).toBe('transactions')
  })

  it('marca la categoría si ya no existe', async () => {
    vi.mocked(createTransactionUseCase).mockRejectedValue(new CategoryNotFoundError())
    const { wrapper } = await mountView(CreateTransactionView)

    await fill(wrapper)
    await wrapper.find('form').trigger('submit')
    await settle()

    expect(wrapper.text()).toContain('La categoría no existe')
  })

  it('pide crear una categoría si no hay ninguna', async () => {
    vi.mocked(getCategoriesUseCase).mockResolvedValue([])
    const { wrapper } = await mountView(CreateTransactionView)

    expect(wrapper.text()).toContain('necesitas una categoría')
    expect(wrapper.find('form').exists()).toBe(false)
  })
})

describe('EditTransactionView', () => {
  it('carga los datos y bloquea la categoría', async () => {
    vi.mocked(getTransactionUseCase).mockResolvedValue(transaction)
    const { wrapper } = await mountView(EditTransactionView, { props: { id: 't1' } })

    const select = wrapper.findAll<HTMLSelectElement>('select')[1]
    expect(select?.element.value).toBe('c1')
    expect(select?.attributes('disabled')).toBeDefined()
    expect(wrapper.find<HTMLInputElement>('input[type="number"]').element.value).toBe('150.5')
    expect(wrapper.find<HTMLInputElement>('input[type="date"]').element.value).toBe('2026-06-16')
  })

  it('envía la transacción y lo escrito al caso de uso', async () => {
    vi.mocked(getTransactionUseCase).mockResolvedValue(transaction)
    vi.mocked(updateTransactionUseCase).mockResolvedValue(transaction)
    const { wrapper, router } = await mountView(EditTransactionView, { props: { id: 't1' } })

    await wrapper.find('input[type="number"]').setValue('200')
    await wrapper.find('form').trigger('submit')
    await settle()

    const command = vi.mocked(updateTransactionUseCase).mock.calls[0]?.[0]
    expect(command?.transaction.id).toBe('t1')
    expect(command?.input.amount).toBe(200)
    expect(router.currentRoute.value.name).toBe('transactions')
  })

  it('muestra un mensaje si no existe', async () => {
    vi.mocked(getTransactionUseCase).mockRejectedValue(new TransactionNotFoundError())
    const { wrapper } = await mountView(EditTransactionView, { props: { id: 'abc' } })

    expect(wrapper.text()).toContain('La transacción no existe')
    expect(wrapper.find('form').exists()).toBe(false)
  })
})
