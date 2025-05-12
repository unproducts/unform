<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-backdrop">
      <div :class="['modal-content', customClass]">
        <div class="flex justify-between items-center mb-4">
          <h2 :class="['text-xl font-bold', titleClass]">{{ title }}</h2>
          <button
            @click="$emit('update:modelValue', false)"
            :class="['hover:text-bermuda-600', closeButtonClass]"
            :disabled="disableClose"
          >
            <span class="sr-only">Close</span>
            <Icon name="material-symbols:close" class="h-6 w-6" />
          </button>
        </div>
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  titleClass: {
    type: String,
    default: 'text-bermuda-800',
  },
  closeButtonClass: {
    type: String,
    default: 'text-bermuda-400',
  },
  customClass: {
    type: String,
    default: 'max-w-md w-full',
  },
  disableClose: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['update:modelValue']);
</script>
