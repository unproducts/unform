<template>
  <div class="min-h-screen bg-bermuda-50">
    <NavBar v-if="showNavBar" />
    <main class="container mx-auto px-4 md:px-6 py-4 md:py-8 max-w-7xl">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const showNavBar = computed(() => !['/login', '/register', '/'].includes(route.path));
</script>

<style>
/* Ensure proper viewport scaling on mobile */
@viewport {
  width: device-width;
  zoom: 1;
}
</style>
