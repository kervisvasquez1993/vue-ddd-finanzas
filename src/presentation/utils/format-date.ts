/** YYYY-MM-DD a DD/MM/YYYY, sin pasar por Date para evitar corrimientos de zona horaria. */
export const formatDate = (value: string) => value.split('-').reverse().join('/')
