import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { getDashboardUseCase } from '@/modules/dashboard/di'
import {
  DashboardSummaryEntity,
  type DashboardSummaryProps,
} from '@/modules/dashboard/domain/entities'
import DashboardView from '@/modules/dashboard/presentation/views/DashboardView.vue'

vi.mock('@/modules/dashboard/di')

const period = { startDate: '2026-06-01', endDate: '2026-06-30' }

const summary = (overrides: Partial<DashboardSummaryProps> = {}) =>
  new DashboardSummaryEntity({
    saldoAtual: 2300,
    totalEntradas: 2500,
    totalSaidas: 200,
    topCategoriasSaidas: [{ categoryId: 'c1', categoryName: 'Fornecedor', total: 200 }],
    periodo: { startDate: null, endDate: null },
    ...overrides,
  })

const settle = async () => {
  await new Promise((resolve) => setTimeout(resolve, 20))
  await flushPromises()
}

const mountView = async () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'dashboard', component: { template: '<div />' } },
      { path: '/login', name: 'login', component: { template: '<div />' } },
      { path: '/categories', name: 'categories', component: { template: '<div />' } },
      { path: '/transactions', name: 'transactions', component: { template: '<div />' } },
      {
        path: '/transactions/new',
        name: 'transactions-create',
        component: { template: '<div />' },
      },
    ],
  })
  await router.push('/')
  const queryClient = new QueryClient({ defaultOptions: { queries: { retryDelay: 0 } } })
  const wrapper = mount(DashboardView, {
    global: { plugins: [pinia, router, [VueQueryPlugin, { queryClient }]] },
  })
  return wrapper
}

describe('DashboardView', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
  })

  it('muestra el skeleton mientras carga', async () => {
    vi.mocked(getDashboardUseCase).mockReturnValue(new Promise(() => {}))
    const wrapper = await mountView()

    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(true)
  })

  it('muestra los totales y el saldo total sin período', async () => {
    vi.mocked(getDashboardUseCase).mockResolvedValue(summary())
    const wrapper = await mountView()
    await settle()

    const text = wrapper.text().replace(/\s/g, ' ')
    expect(text).toContain('Saldo total')
    expect(text).toContain('Todo el historial')
    expect(text).toContain('R$ 2.300,00')
    expect(text).toContain('Fornecedor')
  })

  it('rotula el saldo como del período al filtrar', async () => {
    vi.mocked(getDashboardUseCase).mockResolvedValue(summary({ periodo: period }))
    const wrapper = await mountView()
    await settle()

    expect(wrapper.text()).toContain('Saldo del período')
    expect(wrapper.text()).toContain('Del 01/06/2026 al 30/06/2026')
  })

  it('aplica el filtro y vuelve a consultar', async () => {
    vi.mocked(getDashboardUseCase).mockResolvedValue(summary())
    const wrapper = await mountView()
    await settle()

    const [start, end] = wrapper.findAll('input[type="date"]')
    await start?.setValue(period.startDate)
    await end?.setValue(period.endDate)
    await wrapper.find('form').trigger('submit')
    await settle()

    expect(getDashboardUseCase).toHaveBeenLastCalledWith(period)
  })

  it('limpiar quita el filtro', async () => {
    vi.mocked(getDashboardUseCase).mockResolvedValue(summary())
    const wrapper = await mountView()
    await settle()

    await wrapper.find('input[type="date"]').setValue(period.startDate)
    await wrapper.find('form').trigger('submit')
    await settle()
    const clearButton = wrapper.findAll('button').find((b) => b.text() === 'Limpiar')
    await clearButton?.trigger('click')
    await settle()

    expect(vi.mocked(getDashboardUseCase).mock.lastCall?.[0]).toEqual({})
    expect((wrapper.find('input[type="date"]').element as HTMLInputElement).value).toBe('')
  })

  it('no consulta si el rango está invertido', async () => {
    vi.mocked(getDashboardUseCase).mockResolvedValue(summary())
    const wrapper = await mountView()
    await settle()
    vi.mocked(getDashboardUseCase).mockClear()

    const [start, end] = wrapper.findAll('input[type="date"]')
    await start?.setValue(period.endDate)
    await end?.setValue(period.startDate)
    await wrapper.find('form').trigger('submit')
    await settle()

    expect(wrapper.text()).toContain('Debe ser igual o posterior a la fecha inicial')
    expect(getDashboardUseCase).not.toHaveBeenCalled()
  })

  it('muestra el estado vacío sin movimientos', async () => {
    vi.mocked(getDashboardUseCase).mockResolvedValue(
      summary({ saldoAtual: 0, totalEntradas: 0, totalSaidas: 0, topCategoriasSaidas: [] }),
    )
    const wrapper = await mountView()
    await settle()

    expect(wrapper.text()).toContain('No hay movimientos')
  })

  it('avisa si hay entradas pero ninguna salida', async () => {
    vi.mocked(getDashboardUseCase).mockResolvedValue(
      summary({ totalSaidas: 0, topCategoriasSaidas: [] }),
    )
    const wrapper = await mountView()
    await settle()

    expect(wrapper.text()).toContain('No hay salidas en este período.')
  })

  it('permite reintentar tras un error', async () => {
    vi.mocked(getDashboardUseCase).mockRejectedValueOnce({ response: { status: 401 } })
    vi.mocked(getDashboardUseCase).mockResolvedValue(summary())
    const wrapper = await mountView()
    await settle()

    expect(wrapper.text()).toContain('No pudimos cargar el resumen')

    await wrapper.find('[role="alert"] button').trigger('click')
    await settle()

    expect(wrapper.text()).toContain('Saldo total')
  })
})
