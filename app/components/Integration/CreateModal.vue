<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'update:modelValue', value: boolean): void;
}>();

const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const handleSubmit = () => {
  emit('submit');
  showModal.value = false;
};

const handleCancel = () => {
  showModal.value = false;
};
</script>

<template>
  <Modal title="Create Integration" v-model="showModal">
    <IntegrationForm @submit="handleSubmit" @cancel="handleCancel" :show-config-form="false" />
  </Modal>
</template>
