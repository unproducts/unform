<template>
  <div class="flex items-center justify-center min-h-screen bg-bermuda-50 px-4">
    <div class="text-center">
      <div class="text-6xl font-bold text-bermuda-600 mb-4">{{ error.statusCode }}</div>
      <h1 class="text-3xl font-bold text-bermuda-800 mb-4">{{ errorMessage }}</h1>
      <p class="text-bermuda-600 mb-8">{{ errorDescription }}</p>
      <button @click="handleError" class="btn-primary">Back to Home</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object,
});

const errorMessage = computed(() => {
  if (props.error.statusCode === 404) return 'Page not found';
  return 'An error occurred';
});

const errorDescription = computed(() => {
  if (props.error.statusCode === 404) {
    return "The page you are looking for doesn't exist or has been moved.";
  }
  return 'Something went wrong. Please try again later.';
});

function handleError() {
  clearError({ redirect: '/' });
}
</script>
