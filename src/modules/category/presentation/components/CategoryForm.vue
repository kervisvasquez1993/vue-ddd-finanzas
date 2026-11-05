<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { CategoryEntity } from '@/modules/category/domain/entities'
import BaseButton from '@/shared/presentation/components/BaseButton.vue'
import FormAlert from '@/shared/presentation/components/FormAlert.vue'
import FormField from '@/shared/presentation/components/FormField.vue'
import { useCategoryForm } from '@/modules/category/presentation/composables/use-category-form'

const props = defineProps<{ category?: CategoryEntity; submitLabel: string }>()

const { name, nameAttrs, description, descriptionAttrs, errors, formErrors, isPending, onSubmit } =
  useCategoryForm(props.category)
</script>

<template>
  <form
    class="flex max-w-lg flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6"
    novalidate
    @submit="onSubmit"
  >
    <FormAlert :messages="formErrors" />
    <FormField v-model="name" v-bind="nameAttrs" label="Nombre" :error="errors.name" />
    <FormField
      v-model="description"
      v-bind="descriptionAttrs"
      label="Descripción (opcional)"
      :error="errors.description"
    />
    <div class="flex justify-end gap-2">
      <RouterLink
        class="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
        :to="{ name: 'categories' }"
      >
        Cancelar
      </RouterLink>
      <BaseButton type="submit" :loading="isPending">{{ submitLabel }}</BaseButton>
    </div>
  </form>
</template>
