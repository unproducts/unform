<template>
  <Modal v-model="showModal" title="Response Details" custom-class="max-w-2xl w-full">
    <div v-if="response" class="space-y-4">
      <div class="text-sm text-bermuda-600">
        Submitted on {{ formatDate(response.createdAt) }} at {{ formatTime(response.createdAt) }}
      </div>

      <div class="bg-bermuda-50 p-4 rounded-md overflow-auto max-h-80">
        <pre class="text-sm text-bermuda-700">{{ JSON.stringify(response.data, null, 2) }}</pre>
      </div>
    </div>

    <div class="flex justify-end mt-6">
      <button @click="showModal = false" class="btn-secondary">Close</button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { type FormResponse } from '~~/shared/schemas/form';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  response: {
    type: Object as () => FormResponse | null,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString();
}
</script>
