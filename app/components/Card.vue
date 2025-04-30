<script setup lang="ts">
defineProps<{
  title?: string;
  titleClass?: string;
}>();
</script>

<template>
  <div class="card my-4">
    <h2 class="text-lg font-medium text-bermuda-700 mb-4" v-if="title" :class="titleClass">
      {{ title }}
    </h2>
    <slot></slot>
  </div>
</template>
