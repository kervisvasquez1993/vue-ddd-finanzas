# Sistema Financiero (Vue)

Lee `README.md` para la arquitectura, las reglas de dependencias y los pasos para agregar un módulo.
Para crear módulos usa la skill `vue-ddd-module`, que sigue esta misma estructura.

## Reglas clave

- `domain/` y `aplication/` son agnósticos: no importan `vue`, librerías de Vue ni `infrastructure/`.
- Si un archivo importa Vue o una librería de Vue, va en `presentation/`.
- `presentation/` obtiene los casos de uso desde `src/composition/`.
- Los repositorios traducen errores con `toDomainError`. `presentation` decide por la clase del
  error, nunca por códigos HTTP.
- Los tests van en `tests/`, espejando `src/`.

## Antes de terminar

Corre `npm run type-check`, `npx vitest run`, `npx oxlint .` y `npx eslint .` con un Node compatible:
el Node por defecto de esta máquina es demasiado antiguo.
