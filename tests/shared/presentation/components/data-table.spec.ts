import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { Component } from 'vue'
import DataTable from '@/shared/presentation/components/DataTable.vue'

// Un componente genérico no se puede inferir desde mount; aquí solo importa lo que renderiza.
const Table = DataTable as Component

const props = {
  rows: [{ id: '1', name: 'Ana', total: 10 }],
  columns: [
    { key: 'name', label: 'Nombre' },
    { key: 'total', label: 'Total', align: 'right' as const },
  ],
  rowKey: (row: { id: string }) => row.id,
}

describe('DataTable', () => {
  it('muestra el valor de la columna por defecto', () => {
    const wrapper = mount(Table, { props })

    expect(wrapper.findAll('th').map((th) => th.text())).toEqual(['Nombre', 'Total'])
    expect(wrapper.findAll('td').map((td) => td.text())).toEqual(['Ana', '10'])
  })

  it('el slot de una celda recibe la fila', () => {
    const wrapper = mount(Table, {
      props,
      slots: { 'cell-total': '<template #cell-total="{ row }">R$ {{ row.total }}</template>' },
    })

    expect(wrapper.findAll('td')[1]?.text()).toBe('R$ 10')
  })
})
