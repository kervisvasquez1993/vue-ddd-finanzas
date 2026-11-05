<script setup lang="ts">
defineProps<{ messages: string[] }>()
</script>

<template>
  <ul
    v-if="messages.length"
    role="alert"
    class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
  >
    <li v-for="message in messages" :key="message">{{ message }}</li>
  </ul>
</template>
