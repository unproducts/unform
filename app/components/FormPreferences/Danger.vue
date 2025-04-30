<template>
  <Card title="Danger Zone" class="border border-red-200 bg-red-50" title-class="text-red-600">
    <div class="space-y-4">
      <p class="text-red-600 bg-red-50 p-3 rounded text-sm" v-if="error">
        {{ error }}
      </p>
      <p class="text-red-600">Once you delete a form, there is no going back. Please be certain.</p>
      <button @click="showDeleteConfirmModal = true" class="btn-danger" :disabled="isLoading">
        <span v-if="isLoading">Deleting...</span>
        <span v-else>Delete Form</span>
      </button>
    </div>
  </Card>
  <ConfirmationModal
    v-model="showDeleteConfirmModal"
    title="Delete Form"
    message="Are you sure you want to delete this form? This action cannot be undone and will delete all responses associated with this form."
    confirm-text="Yes, Delete Form"
    loading-text="Deleting..."
    :loading="isLoading"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import type { Form } from '~~/shared/schemas/form';

const props = defineProps<{
  form: Form;
}>();

const { isLoading, error, deleteForm } = useForms();

const showDeleteConfirmModal = ref(false);

const confirmDelete = () => {
  deleteForm(props.form.id).then(() => {
    showDeleteConfirmModal.value = false;
    navigateTo('/forms');
  });
};
</script>
