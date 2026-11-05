# Sistema Financeiro

Frontend em Vue 3 do sistema de gestão financeira. Segue DDD + Clean Architecture: as regras de
negócio não dependem do Vue, e tudo o que é específico do framework fica em `presentation/`.

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
- Axios atrás de um adapter em `infrastructure/api`
- Tailwind e vue-sonner
- Vitest e `@vue/test-utils`

## Arquitetura

O projeto é organizado em camadas, e **as dependências sempre apontam para dentro**: as camadas
externas conhecem as internas, nunca o contrário. Assim, o núcleo de negócio não muda quando se troca
o framework, a biblioteca HTTP ou a API.

```
┌──────────────────────────────────────────────────────────────────┐
│  CAMADA EXTERNA: detalhes que podem mudar                        │
│  presentation · router · infrastructure · di                     │
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
| `infrastructure` | Falar com o mundo externo | Adapter do axios, actions, mappers e repositórios | Não |
| `di` | Unir contratos e implementações | Instâncias dos casos de uso | Não |
| `presentation` | Mostrar e interagir | Queries, mutations, composables, componentes, schemas, stores e views | Sim |
| `router` | Navegação | Rotas e guards | Sim |

Se um arquivo importa o Vue ou uma biblioteca do Vue, ele fica em `presentation/` (ou em `router/`,
quando se trata de navegação).

### Direção das dependências

```
router ──► presentation ──► di ──► aplication ──► domain
                            │                       ▲
                            └──► infrastructure ────┘
```

| Camada | Pode importar |
|---|---|
| `domain` | Nada externo |
| `aplication` | `domain` |
| `infrastructure` | `domain` e suas próprias bibliotecas |
| `di` | `aplication` e `infrastructure` |
| `presentation` | `di`, `aplication` (tipos) e `domain` (tipos e classes de erro) |
| `router` | `presentation` |

`main.ts` é a exceção: por ser o ponto de partida, conhece todas as camadas.

### Inversão de dependências

`aplication` depende do contrato definido em `domain`, não da implementação. Quem entrega a
implementação é a pasta `di/`:

```ts
export const getTransactionsUseCase = getTransactionsUseCaseFactory(transactionRepository)
```

- **Inversão de dependências (o princípio):** o caso de uso conhece apenas `ITransactionRepository`.
- **Injeção de dependências (o mecanismo):** `di/` entrega `transactionRepository` à factory. É o mesmo
  papel dos `providers` de um módulo NestJS.

### Estrutura de pastas

```
src/
├── domain/           Entidades, value objects, erros, DTOs e portas. TypeScript puro.
├── aplication/       Casos de uso. TypeScript puro.
├── infrastructure/   Implementa as portas: axios, actions, mappers e repositórios.
├── di/               Conecta cada caso de uso à implementação da sua porta.
├── presentation/     Tudo o que depende do Vue.
│   ├── queries/      useQuery, query keys e política de novas tentativas
│   ├── mutations/    useMutation
│   ├── composables/  Lógica de tela
│   ├── components/
│   ├── schemas/      Validação de formulários com Zod
│   ├── stores/       Pinia, apenas para estado global
│   ├── utils/
│   └── views/
├── router/           Rotas e guards
└── main.ts           Registra os plugins e conecta a sessão à API
```

### Fluxo de uma requisição

```
View → composable → query/mutation → di → caso de uso → porta ← repositório → action → API
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

## Como adicionar um módulo

1. **`domain/<module>`:** entidades, value objects, erros, DTOs e porta do repositório.
2. **`infrastructure`:** interfaces do backend, mapper, actions e repositório.
3. **`aplication/use-cases/<module>`:** factories que recebem a porta.
4. **`di/<module>.ts`:** conecta cada factory ao seu repositório.
5. **`presentation`:** query ou mutation, schema, composable, componentes e view.
6. **`router/index.ts`:** rota com import dinâmico e seu `meta`.

Depois de uma mutation, invalide as queries afetadas. As transações usam
`useInvalidateTransactionData`, porque alteram a própria lista, o dashboard e os totais por categoria.

## Padrões de componentes

| Necessidade | Padrão | Exemplo |
|---|---|---|
| Estados de carregamento, erro e vazio | `AsyncGuard` com slots | `DashboardView.vue` |
| Lógica de tela | Composable | `use-login-form.ts` |
| Estender um elemento interno | `inheritAttrs: false` + `useAttrs` | `FormField.vue` |
| Personalizar uma parte da renderização | Slot nomeado | `PasswordField.vue` |
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
`src/domain/shared/value-objects/date-range.vo.ts` é testado em
`tests/domain/shared/value-objects/date-range.vo.spec.ts`.

Os casos de uso são testados com a factory e um repositório falso. Nos testes de views, o módulo de
`di` é simulado.
