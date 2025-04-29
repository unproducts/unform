<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-bermuda-800">Your Forms</h1>
      <button @click="showAddFormModal = true" class="btn-primary" :disabled="isLoading">Add Form</button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-600 mb-6">
      {{ error }}
      <button @click="fetchForms" class="text-red-700 underline ml-2">Try again</button>
    </div>

    <EmptyState
      v-else-if="forms.length === 0"
      icon="form"
      message="You don't have any forms yet. Add your first form to get started."
      actionLabel="Add Form"
      :actionClick="() => (showAddFormModal = true)"
    />

    <div v-else class="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="form in forms"
        :key="form.id"
        :to="`/forms/${form.id}`"
        class="card hover:shadow-lg transition-shadow duration-200"
      >
        <h2 class="text-base md:text-lg font-semibold text-bermuda-700 mb-2">{{ form.name }}</h2>
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div class="text-xs md:text-sm text-bermuda-600">{{ formatDate(form.createdAt) }}</div>
          <div class="text-xs md:text-sm text-bermuda-500 flex items-center">
            <svg class="w-3 h-3 md:w-4 md:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View Responses
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Add Form Modal -->
    <Teleport to="body">
      <div v-if="showAddFormModal" class="modal-backdrop">
        <div class="modal-content max-w-md w-full">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-bermuda-800">Add New Form</h2>
            <button @click="closeModal" class="text-bermuda-400 hover:text-bermuda-600" :disabled="formLoading">
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="addForm" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-bermuda-700">Form Name</label>
              <input id="name" v-model="newForm.name" type="text" required class="form-input" />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <div v-if="formError" class="bg-red-50 p-3 rounded text-red-600 text-sm">
              {{ formError }}
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="closeModal" class="btn-secondary" :disabled="formLoading">Cancel</button>
              <button type="submit" class="btn-primary" :disabled="formLoading">
                <span v-if="formLoading">Adding...</span>
                <span v-else>Add Form</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { createFormSchema } from '~~/shared/schemas/form';

const { forms, isLoading, error, fetchForms, createForm } = useForms();
fetchForms();

const showAddFormModal = ref(false);
const newForm = reactive({
  name: '',
});
const errors = ref<Record<string, string>>({});
const formError = ref('');
const formLoading = ref(false);

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

async function addForm() {
  errors.value = {};
  formError.value = '';
  formLoading.value = true;

  try {
    // Validate form data
    createFormSchema.parse(newForm);

    // Submit to API
    await createForm(newForm);

    // Reset form and close modal
    resetForm();
    showAddFormModal.value = false;
  } catch (error: any) {
    // Handle validation errors
    if (error.errors) {
      error.errors.forEach((err: any) => {
        if (err.path && err.path.length > 0) {
          errors.value[err.path[0]] = err.message;
        }
      });
    } else {
      formError.value = error.message || 'Failed to create form. Please try again.';
    }
  } finally {
    formLoading.value = false;
  }
}

function closeModal() {
  showAddFormModal.value = false;
  resetForm();
}

function resetForm() {
  newForm.name = '';
  errors.value = {};
  formError.value = '';
}
</script>
