<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AuthCard from '@/presentation/components/auth/AuthCard.vue'
import BaseButton from '@/presentation/components/shared/BaseButton.vue'
import FormAlert from '@/presentation/components/shared/FormAlert.vue'
import FormField from '@/presentation/components/shared/FormField.vue'
import PasswordField from '@/presentation/components/shared/PasswordField.vue'
import { useRegisterForm } from '@/presentation/composables/auth/use-register-form'

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
