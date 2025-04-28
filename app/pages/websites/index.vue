<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-bermuda-800">Your Websites</h1>
      <button @click="showAddWebsiteModal = true" class="btn-primary" :disabled="isLoading">Add Website</button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-600 mb-6">
      {{ error }}
      <button @click="fetchWebsites" class="text-red-700 underline ml-2">Try again</button>
    </div>

    <EmptyState
      v-else-if="websites.length === 0"
      icon="website"
      message="You don't have any websites yet. Add your first website to get started."
      actionLabel="Add Website"
      :actionClick="() => (showAddWebsiteModal = true)"
    />

    <div v-else class="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="website in websites"
        :key="website.id"
        :to="`/websites/${website.id}`"
        class="card hover:shadow-lg transition-shadow duration-200"
      >
        <h2 class="text-base md:text-lg font-semibold text-bermuda-700 mb-2">{{ website.name }}</h2>
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div class="text-xs md:text-sm text-bermuda-600">{{ formatDate(website.createdAt) }}</div>
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

    <!-- Add Website Modal -->
    <Teleport to="body">
      <div v-if="showAddWebsiteModal" class="modal-backdrop">
        <div class="modal-content max-w-md w-full">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-bermuda-800">Add New Website</h2>
            <button @click="closeModal" class="text-bermuda-400 hover:text-bermuda-600" :disabled="formLoading">
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="addWebsite" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-bermuda-700">Website Name</label>
              <input id="name" v-model="newWebsite.name" type="text" required class="form-input" />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <div>
              <label for="domain" class="block text-sm font-medium text-bermuda-700">Domain</label>
              <input
                id="domain"
                v-model="newWebsite.domain"
                type="url"
                required
                placeholder="https://example.com"
                class="form-input"
              />
              <p v-if="errors.domain" class="mt-1 text-sm text-red-600">{{ errors.domain }}</p>
            </div>

            <div v-if="formError" class="bg-red-50 p-3 rounded text-red-600 text-sm">
              {{ formError }}
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="closeModal" class="btn-secondary" :disabled="formLoading">Cancel</button>
              <button type="submit" class="btn-primary" :disabled="formLoading">
                <span v-if="formLoading">Adding...</span>
                <span v-else>Add Website</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { createWebsiteSchema } from '~~/shared/schemas/website';

const { websites, isLoading, error, fetchWebsites, createWebsite } = useWebsites();

// Fetch websites when the component is mounted
onMounted(async () => {
  await fetchWebsites();
});

const showAddWebsiteModal = ref(false);
const newWebsite = reactive({
  name: '',
  domain: '',
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

async function addWebsite() {
  errors.value = {};
  formError.value = '';
  formLoading.value = true;

  try {
    // Validate form data
    createWebsiteSchema.parse(newWebsite);

    // Submit to API
    await createWebsite(newWebsite);

    // Reset form and close modal
    resetForm();
    showAddWebsiteModal.value = false;
  } catch (error: any) {
    // Handle validation errors
    if (error.errors) {
      error.errors.forEach((err: any) => {
        if (err.path && err.path.length > 0) {
          errors.value[err.path[0]] = err.message;
        }
      });
    } else {
      formError.value = error.message || 'Failed to create website. Please try again.';
    }
  } finally {
    formLoading.value = false;
  }
}

function closeModal() {
  showAddWebsiteModal.value = false;
  resetForm();
}

function resetForm() {
  newWebsite.name = '';
  newWebsite.domain = '';
  errors.value = {};
  formError.value = '';
}
</script>

<style scoped>
.form-input {
  @apply mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bermuda-500 focus:border-bermuda-500 sm:text-sm;
}

.modal-backdrop {
  @apply fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50;
}

.modal-content {
  @apply bg-white p-6 rounded-lg shadow-xl;
}

.btn-primary {
  @apply px-4 py-2 bg-bermuda-500 text-white rounded-md hover:bg-bermuda-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bermuda-500;
}

.btn-secondary {
  @apply px-4 py-2 bg-white text-bermuda-700 border border-bermuda-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bermuda-500;
}

.spinner {
  @apply h-8 w-8 rounded-full border-4 border-bermuda-200 border-t-bermuda-600 animate-spin;
}
</style>
