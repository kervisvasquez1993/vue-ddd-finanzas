# Sistema Financeiro

Frontend em Vue 3 do sistema de gestão financeira. Segue DDD + Clean Architecture, organizado por
módulos: as regras de negócio não dependem do Vue, e tudo o que é específico do framework fica em
`presentation/`.

## Requisitos

- Node `^22.18.0` ou `>=24.12.0`
- Backend rodando em `http://localhost:3000/api`, com as migrations executadas

## Como executar

```bash
npm install
cp .env.example .env
npm run dev
```

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API |

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Type-check e build de produção |
| `npm run type-check` | Verifica os tipos com `vue-tsc` |
| `npm run test:unit` | Testes com Vitest |
| `npm run test:e2e` | Testes com Playwright |
| `npm run lint` | oxlint e ESLint, com correção automática |
| `npm run format` | Formata `src/` e `tests/` |

## Stack

- Vue 3, vue-router e Pinia
- `@tanstack/vue-query` para dados do servidor
- VeeValidate e Zod para formulários
- Axios atrás de um único adapter em `src/api`
- Tailwind e vue-sonner
- Vitest e `@vue/test-utils`

## Arquitetura

### Visão geral

O código é dividido por **módulos de negócio**, e cada módulo tem as próprias camadas. O que é comum
a todos fica fora deles: `api/` concentra o adapter HTTP, `shared/` guarda o código reutilizável, e
`router/` e `layouts/` montam a aplicação.

```
┌─────────────────────────────────────────────────────────────────┐
│  main.ts · router · layouts · pages                             │
└───────┬────────────────┬────────────────┬────────────────┬──────┘
        ▼                ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│     auth     │ │  dashboard   │ │ transaction  │ │   category   │
│              │ │              │ │              │ │              │
│  camadas do  │ │  camadas do  │ │  camadas do  │ │  camadas do  │
│    módulo    │ │    módulo    │ │    módulo    │ │    módulo    │
└───────┬──────┘ └───────┬──────┘ └───────┬──────┘ └───────┬──────┘
        ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│  api (adapter HTTP) · shared (componentes, erros e utilitários) │
└─────────────────────────────────────────────────────────────────┘
```

`pages/` ainda não existe: só é criada quando uma tela não tiver um módulo dono.

### Camadas de um módulo

Cada módulo é organizado em camadas, e **as dependências sempre apontam para dentro**: as camadas
externas conhecem as internas, nunca o contrário. Assim, o núcleo de negócio não muda quando se troca
o framework, a biblioteca HTTP ou a API.

```
┌──────────────────────────────────────────────────────────────────┐
│  CAMADA EXTERNA: detalhes que podem mudar                        │
│  presentation · infrastructure · di                              │
│                                                                  │
│     ┌────────────────────────────────────────────────────────┐   │
│     │  APLICATION: casos de uso                              │   │
│     │                                                        │   │
│     │     ┌──────────────────────────────────────────────┐   │   │
│     │     │  DOMAIN: regras de negócio e contratos       │   │   │
│     │     └──────────────────────────────────────────────┘   │   │
│     └────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### O que cada camada contém

| Camada | Responsabilidade | O que contém | Depende de Vue? |
|---|---|---|---|
| `domain` | Regras de negócio e contratos | Entidades, value objects, erros, DTOs e portas (`ITransactionRepository`) | Não |
| `aplication` | Orquestrar as regras | Casos de uso, como factories que recebem as portas | Não |
| `infrastructure` | Falar com o mundo externo | Actions, mappers e repositórios | Não |
| `di.ts` | Unir contratos e implementações | Instâncias dos casos de uso | Não |
| `presentation` | Mostrar e interagir | Queries, mutations, composables, componentes, schemas, stores e views | Sim |

Se um arquivo de um módulo importa o Vue ou uma biblioteca do Vue, ele fica em `presentation/`.

### Direção das dependências

Dentro de um módulo:

```
presentation ──► di.ts ──► aplication ──► domain
                   │                        ▲
                   └───► infrastructure ────┘
```

| Camada | Pode importar |
|---|---|
| `domain` | `shared/domain` |
| `aplication` | `domain` e `shared/domain` |
| `infrastructure` | `domain`, `shared/domain` e `src/api` |
| `di.ts` | `aplication` e `infrastructure` |
| `presentation` | `di.ts`, `aplication` (tipos), `domain` (tipos e classes de erro), `shared` e o `index.ts` de outros módulos |

Entre as pastas de `src/`:

```
router · layouts · pages ──► modules ──► shared
                                │          ▲
                                └─► api ───┘
```

`shared/` e `api/` nunca importam de `modules/`. `main.ts` é a exceção: por ser o ponto de partida,
conhece tudo.

### Inversão de dependências

`aplication` depende do contrato definido em `domain`, não da implementação. Quem entrega a
implementação é o `di.ts` do módulo:

```ts
export const getTransactionsUseCase = getTransactionsUseCaseFactory(transactionRepository)
```

- **Inversão de dependências (o princípio):** o caso de uso conhece apenas `ITransactionRepository`.
- **Injeção de dependências (o mecanismo):** `di.ts` entrega `transactionRepository` à factory. É o mesmo
  papel dos `providers` de um módulo NestJS.

### Estrutura de pastas

```
src/
├── main.ts                 Registra os plugins e conecta a sessão à API
├── App.vue                 Raiz: RouterView e Toaster
├── assets/                 CSS global
├── api/                    Adapter HTTP único: axios, authApi, publicApi e toDomainError
├── router/                 Une as rotas dos módulos e define os guards
├── layouts/                AppLayout, aplicado na rota pai
├── shared/                 Código reutilizável, sem conhecer nenhum módulo
│   ├── domain/             Erros, value objects e paginação
│   └── presentation/       Componentes, composables, query roots e utils
└── modules/
    ├── auth/
    ├── category/
    ├── dashboard/
    └── transaction/
        ├── domain/         Entidades, value objects, erros, DTOs e portas
        ├── aplication/     Casos de uso
        ├── infrastructure/ Actions, interfaces, mappers e repositórios
        ├── presentation/   Queries, mutations, composables, componentes, schemas e views
        ├── di.ts           Conecta cada caso de uso à implementação da sua porta
        ├── routes.ts       Rotas do módulo
        └── index.ts        API pública, apenas se outro módulo precisar dela
```

### Fluxo de uma requisição

```
View → composable → query/mutation → di.ts → caso de uso → porta ← repositório → action → API
```

### Erros

O HTTP não sai de `infrastructure`. Os repositórios usam `toDomainError` para traduzir cada falha em
um erro de domínio, e `presentation` decide de acordo com a classe do erro.

| Resposta | Erro de domínio | Na interface |
|---|---|---|
| `400` | `RequestValidationError` | Lista no formulário |
| `401` no login | `InvalidCredentialsError` | Mensagem no formulário |
| `401` em rota protegida | `UnauthorizedError` | Limpa a sessão e vai para o login |
| `409` no cadastro | `EmailAlreadyRegisteredError` | Erro no campo de email |
| `5xx` ou sem resposta | `ServiceUnavailableError` | Toast genérico. As queries tentam novamente |

Decida sempre pelo `statusCode`: o backend não tem códigos de erro estáveis e o idioma das mensagens
varia.

### Sessão

`publicApi` não usa interceptors; `authApi` adiciona o token e reage ao `401`. `infrastructure` não
conhece o store: `main.ts` injeta os handlers com `configureApiAuth`.

O token fica no `localStorage`, porque o backend o devolve no body. Não há refresh nem logout no
servidor: encerrar a sessão apenas apaga o token local.

## Módulos

### API pública

Um módulo só usa o que outro expõe em `index.ts`, nunca as pastas internas dele. Se ninguém precisa, o
arquivo não existe. Hoje, `auth` expõe `useAuthStore` e `useLogout`, e `category` expõe
`useCategoriesQuery`.

`domain` e `infrastructure` não importam de outros módulos, porque o `index.ts` traz o Vue junto. Por
isso `transaction` tem o próprio `TransactionCategoryNotFoundError`.

Não pode haver ciclos entre módulos. Categorias e transações invalidam os dados uma da outra usando
`queryRoots`, em `shared`, sem se importarem.

### Telas de vários módulos

- **Com um módulo principal:** a tela fica nesse módulo e pede o restante pelo `index.ts`.
- **Sem dono claro:** vai para `src/pages/`, que apenas organiza peças exportadas pelos módulos. A pasta
  ainda não existe: crie-a quando surgir o primeiro caso.

### Submódulos

Um submódulo fica em `modules/<module>/<submodule>/`, com as próprias camadas, quando tem contrato ou
casos de uso próprios e só faz sentido junto do módulo pai.

- No máximo um nível.
- O filho conhece o pai, não o contrário.
- Se outros módulos precisarem dele, transforme-o em módulo irmão.
- Mais uma tela ou um componente não justificam um submódulo.

### Como adicionar um módulo

Em `src/modules/<module>/`:

1. **`domain/`:** entidades, value objects, erros, DTOs e porta do repositório.
2. **`infrastructure/`:** interfaces do backend, mapper, actions e repositório.
3. **`aplication/use-cases/`:** factories que recebem a porta.
4. **`di.ts`:** conecta cada factory ao seu repositório.
5. **`presentation/`:** query ou mutation, schema, composable, componentes e view.
6. **`routes.ts`:** rotas com import dinâmico, somadas em `src/router/index.ts`.

Depois de uma mutation, invalide as queries afetadas. As transações usam
`useInvalidateTransactionData`, porque alteram a própria lista, o dashboard e os totais por categoria.

## Padrões de componentes

| Necessidade | Padrão | Exemplo |
|---|---|---|
| Estados de carregamento, erro e vazio | `AsyncGuard` com slots | `DashboardView.vue` |
| Lógica de tela | Composable | `use-login-form.ts` |
| Estender um elemento interno | `inheritAttrs: false` + `useAttrs` | `FormField.vue` |
| Personalizar uma parte da renderização | Slot nomeado | `PasswordField.vue` |
| Layout compartilhado | Rota pai com `<RouterView />` | `AppLayout.vue` |
| Tabela com células personalizadas | `DataTable` com scoped slots `#cell-<key>` | `CategoriesView.vue` |
| Confirmar uma ação | `ConfirmDialog` + `useConfirmAction` | `CategoriesView.vue` |
| Filtros compartilháveis | Estado na URL com `computed` gravável | `use-transaction-filters.ts` |
| Trocar o elemento renderizado | Prop `as` com `<component :is>` | `BaseButton.vue` |

## Limitações conhecidas

- **Categoria de uma transação:** `PATCH /transactions/:id` responde `200` com o novo `categoryId`, mas
  não o salva. Por isso, o formulário de edição bloqueia o campo e `getChanges` nunca o envia. Quando
  isso for corrigido no backend, adicione `categoryId` a `IUpdateTransactionRequest` e a `getChanges`,
  e habilite o campo.
- **Busca:** `%` e `_` funcionam como curingas no backend.
- **Idioma:** a interface está em espanhol. Os valores usam BRL no formato `pt-BR`.

## Testes

Os testes ficam em `tests/`, com a mesma estrutura de `src/`. Por exemplo,
`src/shared/domain/value-objects/date-range.vo.ts` é testado em
`tests/shared/domain/value-objects/date-range.vo.spec.ts`.

Os casos de uso são testados com a factory e um repositório falso. Nos testes de views, o `di.ts` do
módulo é simulado.
