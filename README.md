# Sistema Financiero

Frontend en Vue 3 del sistema de gestión financiera. Sigue DDD + Clean Architecture: la lógica de
negocio no depende de Vue, y todo lo específico del framework vive en `presentation/`.

## Requisitos

- Node `^22.18.0` o `>=24.12.0`
- Backend corriendo en `http://localhost:3000/api`, con las migraciones ejecutadas

## Puesta en marcha

```bash
npm install
cp .env.example .env
npm run dev
```

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API |

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Type-check y build de producción |
| `npm run type-check` | Revisa los tipos con `vue-tsc` |
| `npm run test:unit` | Tests con Vitest |
| `npm run test:e2e` | Tests con Playwright |
| `npm run lint` | oxlint y ESLint, con corrección automática |
| `npm run format` | Formatea `src/` y `tests/` |

## Stack

- Vue 3, vue-router y Pinia
- `@tanstack/vue-query` para datos del servidor
- VeeValidate y Zod para formularios
- Axios detrás de un adapter en `infrastructure/api`
- Tailwind y vue-sonner
- Vitest y `@vue/test-utils`

## Arquitectura

```
src/
├── domain/           Entidades, value objects, errores, DTOs y puertos. TypeScript puro.
├── aplication/       Casos de uso. TypeScript puro.
├── infrastructure/   Implementa los puertos: axios, actions, mappers, repositorios.
├── composition/      Conecta los casos de uso con sus repositorios.
├── presentation/     Todo lo que depende de Vue.
│   ├── queries/      useQuery, query keys y política de reintentos
│   ├── mutations/    useMutation
│   ├── composables/  Lógica de pantalla
│   ├── components/
│   ├── schemas/      Validación de formularios con Zod
│   ├── stores/       Pinia, solo para estado global
│   ├── utils/
│   └── views/
├── router/           Rutas y guards
└── main.ts           Registra los plugins y conecta la sesión con la API
```

### Regla de dependencias

| Capa | Puede importar |
|---|---|
| `domain` | Nada externo |
| `aplication` | `domain` |
| `infrastructure` | `domain` y sus propias librerías |
| `composition` | `aplication` e `infrastructure` |
| `presentation` | `composition`, `aplication` (tipos) y `domain` |
| `router` | `presentation` |

Si un archivo importa Vue o una librería de Vue, va en `presentation`.

`main.ts` es la excepción: al ser el punto de arranque, conoce todas las capas.

### Flujo de una petición

```
View → composable → query/mutation → composition → caso de uso → puerto ← repositorio → action → API
```

### Errores

HTTP no sale de `infrastructure`. Los repositorios usan `toDomainError` para traducir cada fallo a un
error de dominio, y `presentation` decide según su clase.

| Respuesta | Error de dominio | En la UI |
|---|---|---|
| `400` | `RequestValidationError` | Lista en el formulario |
| `401` en login | `InvalidCredentialsError` | Mensaje en el formulario |
| `401` en ruta protegida | `UnauthorizedError` | Limpia la sesión y va a login |
| `409` en registro | `EmailAlreadyRegisteredError` | Error en el campo email |
| `5xx` o sin respuesta | `ServiceUnavailableError` | Toast genérico. Las queries reintentan |

Decide siempre por `statusCode`: el backend no tiene códigos de error estables y sus mensajes varían
de idioma.

### Sesión

`publicApi` no usa interceptores; `authApi` agrega el token y reacciona al `401`. `infrastructure` no
conoce el store: `main.ts` le inyecta los handlers con `configureApiAuth`.

El token se guarda en `localStorage`, porque el backend lo devuelve en el body. No hay refresh ni
logout en el servidor: cerrar sesión solo borra el token local.

## Agregar un módulo

1. **`domain/<module>`:** entidades, value objects, errores, DTOs y puerto del repositorio.
2. **`infrastructure`:** interfaces del backend, mapper, actions y repositorio.
3. **`aplication/use-cases/<module>`:** factories que reciben el puerto.
4. **`composition/<module>.ts`:** conecta cada factory con su repositorio.
5. **`presentation`:** query o mutation, schema, composable, componentes y view.
6. **`router/index.ts`:** ruta con import dinámico y su `meta`.

Después de una mutation, invalida las queries afectadas. Por ejemplo, crear, editar o eliminar una
transacción debe invalidar `dashboardKeys.all`.

## Patrones de componentes

| Necesidad | Patrón | Ejemplo |
|---|---|---|
| Estados de carga, error y vacío | `AsyncGuard` con slots | `DashboardView.vue` |
| Lógica de pantalla | Composable | `use-login-form.ts` |
| Extender un elemento interno | `inheritAttrs: false` + `useAttrs` | `FormField.vue` |
| Personalizar una parte del render | Slot con nombre | `PasswordField.vue` |

## Tests

Los tests viven en `tests/`, con la misma estructura de `src/`. Por ejemplo,
`src/domain/shared/value-objects/date-range.vo.ts` se prueba en
`tests/domain/shared/value-objects/date-range.vo.spec.ts`.

Los casos de uso se prueban con la factory y un repositorio falso. En los tests de views se simula
el módulo de `composition`.
