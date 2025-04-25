<template>
  <div class="min-h-screen bg-bermuda-50">
    <NavBar v-if="showNavBar" />
    <main class="container mx-auto px-4 py-8">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const showNavBar = computed(() => !['/login', '/register'].includes(route.path));
</script>
