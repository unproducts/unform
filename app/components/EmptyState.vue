<template>
  <div class="text-center py-8 md:py-12 bg-white rounded-lg shadow-md">
    <svg
      v-if="icon === 'form'"
      class="h-16 w-16 md:h-20 md:w-20 text-bermuda-300 mx-auto mb-3 md:mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>

    <svg
      v-else-if="icon === 'response'"
      class="h-16 w-16 md:h-20 md:w-20 text-bermuda-300 mx-auto mb-3 md:mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
      />
    </svg>

    <p class="text-sm md:text-base text-bermuda-600 mb-3 md:mb-4">{{ message }}</p>

    <slot name="action">
      <!-- @vue-expect-error -->
      <button v-if="actionLabel && !!actionClick" @click="actionClick" class="btn-primary">
        {{ actionLabel }}
      </button>
    </slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: 'form',
    validator: (value: string) => ['form', 'response'].includes(value),
  },
  message: {
    type: String,
    required: true,
  },
  actionLabel: {
    type: String,
    default: '',
  },
  actionClick: {
    type: Function,
    default: null,
  },
});
</script>
