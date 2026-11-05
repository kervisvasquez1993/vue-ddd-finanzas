/** Fecha local en YYYY-MM-DD. `toISOString()` usa UTC y puede cambiar el día. */
export const today = () => {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}
