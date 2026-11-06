import { readdirSync } from 'node:fs'
import type { Linter } from 'eslint'
import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginVitest from '@vitest/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

// Reglas de arquitectura: cada capa solo puede importar lo que le corresponde (ver README).
const framework = {
  group: [
    'vue',
    'vue-router',
    'pinia',
    '@tanstack/*',
    'vee-validate',
    '@vee-validate/*',
    'vue-sonner',
  ],
  message: 'Esta capa es agnóstica: lo que depende del framework va en presentation.',
}
const libraries = {
  group: ['axios', 'zod'],
  message: 'Esta capa no usa esta librería: axios vive en src/api y Zod en presentation.',
}
const httpClient = {
  group: ['axios'],
  message: 'Usa authApi o publicApi de src/api.',
}
const api = {
  group: ['@/api', '@/api/*'],
  message: 'Solo infrastructure y main.ts pueden usar src/api.',
}
const sharedPresentation = {
  group: ['@/shared/presentation', '@/shared/presentation/*'],
  message: 'Esta capa no puede depender de presentation.',
}
const appLayers = {
  group: ['@/modules', '@/modules/*', '@/layouts', '@/layouts/*', '@/router', '@/router/*'],
  message: 'shared y api no pueden conocer módulos, layouts ni el router.',
}
const layer = (group: string[], name: string) => ({
  group,
  message: `Esta capa no puede importar ${name}.`,
})
const presentationLayer = layer(['**/presentation', '**/presentation/**'], 'presentation')
const infrastructureLayer = layer(['**/infrastructure', '**/infrastructure/**'], 'infrastructure')
const aplicationLayer = layer(['**/aplication', '**/aplication/**'], 'aplication')
const diLayer = layer(['**/di', '**/di.ts'], 'di')

const restrict = (name: string, files: string, patterns: object[]): Linter.Config => ({
  name: `app/architecture/${name}`,
  files: [files],
  rules: { 'no-restricted-imports': ['error', { patterns }] },
})

const modules = readdirSync('src/modules')

const moduleBoundaries = modules.flatMap((module) => {
  const others = modules.filter((other) => other !== module)
  const anyOther = {
    group: others.flatMap((other) => [`@/modules/${other}`, `@/modules/${other}/*`]),
    message: 'domain, aplication e infrastructure no importan de otros módulos.',
  }
  const otherInternals = {
    group: others.map((other) => `@/modules/${other}/*`),
    message: 'Usa el index.ts del otro módulo, no sus carpetas internas.',
  }
  const root = `src/modules/${module}`

  return [
    restrict(`${module}/domain`, `${root}/domain/**`, [
      framework,
      libraries,
      api,
      sharedPresentation,
      presentationLayer,
      infrastructureLayer,
      aplicationLayer,
      diLayer,
      anyOther,
    ]),
    restrict(`${module}/aplication`, `${root}/aplication/**`, [
      framework,
      libraries,
      api,
      sharedPresentation,
      presentationLayer,
      infrastructureLayer,
      diLayer,
      anyOther,
    ]),
    restrict(`${module}/infrastructure`, `${root}/infrastructure/**`, [
      framework,
      libraries,
      sharedPresentation,
      presentationLayer,
      aplicationLayer,
      diLayer,
      anyOther,
    ]),
    restrict(`${module}/di`, `${root}/di.ts`, [
      framework,
      libraries,
      sharedPresentation,
      presentationLayer,
      anyOther,
    ]),
    restrict(`${module}/presentation`, `${root}/presentation/**`, [
      httpClient,
      api,
      infrastructureLayer,
      otherInternals,
    ]),
  ]
})

const architecture = [
  ...moduleBoundaries,
  restrict('shared/domain', 'src/shared/domain/**', [
    framework,
    libraries,
    api,
    appLayers,
    sharedPresentation,
  ]),
  restrict('shared/presentation', 'src/shared/presentation/**', [httpClient, api, appLayers]),
  restrict('api', 'src/api/**', [framework, sharedPresentation, appLayers]),
]

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['tests/**/*'],
  },

  ...architecture,

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,
)
