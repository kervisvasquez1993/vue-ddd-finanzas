/**
 * Raíces de las query keys. Están aquí para que un módulo pueda invalidar datos de otro sin
 * importarlo: categorías y transacciones se invalidan entre sí, y eso sería un ciclo.
 */
export const queryRoots = {
  dashboard: ['dashboard'],
  categories: ['categories'],
  transactions: ['transactions'],
} as const
