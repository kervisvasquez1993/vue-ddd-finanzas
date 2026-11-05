<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AuthCard from '@/modules/auth/presentation/components/AuthCard.vue'
import BaseButton from '@/shared/presentation/components/BaseButton.vue'
import FormAlert from '@/shared/presentation/components/FormAlert.vue'
import FormField from '@/shared/presentation/components/FormField.vue'
import PasswordField from '@/shared/presentation/components/PasswordField.vue'
import { useRegisterForm } from '@/modules/auth/presentation/composables/use-register-form'

const {
  name,
  nameAttrs,
  email,
  emailAttrs,
  password,
  passwordAttrs,
  errors,
  formErrors,
  isPending,
  onSubmit,
} = useRegisterForm()
</script>

<template>
  <AuthCard title="Crear cuenta">
    <form class="flex flex-col gap-4" novalidate @submit="onSubmit">
      <FormAlert :messages="formErrors" />
      <FormField
        v-model="name"
        v-bind="nameAttrs"
        label="Nombre"
        autocomplete="name"
        :error="errors.name"
      />
      <FormField
        v-model="email"
        v-bind="emailAttrs"
        label="Email"
        type="email"
        autocomplete="email"
        :error="errors.email"
      />
      <PasswordField
        v-model="password"
        v-bind="passwordAttrs"
        label="Contraseña"
        autocomplete="new-password"
        :error="errors.password"
      />
      <BaseButton type="submit" :loading="isPending">
        {{ isPending ? 'Creando...' : 'Crear cuenta' }}
      </BaseButton>
    </form>

    <template #footer>
      ¿Ya tienes cuenta?
      <RouterLink class="font-medium text-slate-900 underline" :to="{ name: 'login' }">
        Inicia sesión
      </RouterLink>
    </template>
  </AuthCard>
</template>
