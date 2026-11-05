<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AuthCard from '@/presentation/components/auth/AuthCard.vue'
import BaseButton from '@/presentation/components/shared/BaseButton.vue'
import FormAlert from '@/presentation/components/shared/FormAlert.vue'
import FormField from '@/presentation/components/shared/FormField.vue'
import PasswordField from '@/presentation/components/shared/PasswordField.vue'
import { useLoginForm } from '@/presentation/composables/auth/use-login-form'

const { email, emailAttrs, password, passwordAttrs, errors, formErrors, isPending, onSubmit } =
  useLoginForm()
</script>

<template>
  <AuthCard title="Iniciar sesión">
    <form class="flex flex-col gap-4" novalidate @submit="onSubmit">
      <FormAlert :messages="formErrors" />
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
        autocomplete="current-password"
        :error="errors.password"
      />
      <BaseButton type="submit" :loading="isPending">
        {{ isPending ? 'Entrando...' : 'Entrar' }}
      </BaseButton>
    </form>

    <template #footer>
      ¿No tienes cuenta?
      <RouterLink class="font-medium text-slate-900 underline" :to="{ name: 'register' }">
        Regístrate
      </RouterLink>
    </template>
  </AuthCard>
</template>
