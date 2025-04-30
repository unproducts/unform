<template>
  <Modal v-model="showModal" title="Add New Form">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="error" class="bg-red-50 p-3 rounded text-red-600 text-sm">
        {{ error }}
      </div>
      <input
        type="text"
        class="form-input"
        placeholder="Form Name"
        v-model="formData.name"
        @input="validate"
        @blur="validate"
      />
      <div v-if="validationErrors['name']" class="text-red-600 text-xs">{{ validationErrors['name'] }}</div>

      <div class="flex justify-end space-x-3 mt-6">
        <button type="button" @click="closeModal" class="btn-secondary" :disabled="isLoading">Cancel</button>
        <button type="submit" class="btn-primary" :disabled="isLoading || hasValidationErrors">
          <span v-if="isLoading">Adding...</span>
          <span v-else>Add Form</span>
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { createFormSchema } from '~~/shared/schemas/form';

const emit = defineEmits(['form-created']);
const showModal = defineModel<boolean>('modelValue', { required: true });

const { createForm, error, isLoading } = useForms();
const formData = reactive({
  name: '',
});

const validationErrors = ref<Record<string, string>>({});
const hasValidationErrors = computed(() => Object.keys(validationErrors.value).length > 0);

async function handleSubmit(): Promise<void> {
  if (hasValidationErrors.value) {
    return;
  }
  createFormSchema.parse(formData);
  const newForm = await createForm(formData);
  resetForm();
  emit('form-created', newForm);
  closeModal();
}

function validate(): void {
  try {
    validationErrors.value = {};
    createFormSchema.parse(formData);
  } catch (err: any) {
    validationErrors.value = err.errors.reduce((acc: Record<string, string>, err: any) => {
      acc[err.path[0]] = err.message;
      return acc;
    }, {});
  }
}

function closeModal(): void {
  resetForm();
  showModal.value = false;
}

function resetForm(): void {
  formData.name = '';
  validationErrors.value = {};
}
</script>
