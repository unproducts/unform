<template>
  <Modal v-model="showModal" :title="title" :title-class="titleClass">
    <div class="mb-6">
      <p class="text-gray-700">{{ message }}</p>
    </div>

    <div class="flex justify-end space-x-3">
      <button type="button" @click="cancel" class="btn-secondary" :disabled="loading">
        {{ cancelText }}
      </button>
      <button type="button" @click="confirm" :class="confirmButtonClass" :disabled="loading">
        <span v-if="loading">{{ loadingText }}</span>
        <span v-else>{{ confirmText }}</span>
      </button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title?: string;
  titleClass?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loadingText?: string;
  confirmButtonClass?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  titleClass: 'text-red-600',
  message: 'Are you sure you want to perform this action?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  loadingText: 'Processing...',
  confirmButtonClass: 'btn-danger',
  loading: false,
});

const emit = defineEmits(['confirm', 'cancel']);

const showModal = defineModel<boolean>('modelValue', { required: true });

function confirm(): void {
  emit('confirm');
}

function cancel(): void {
  emit('cancel');
  showModal.value = false;
}
</script>
