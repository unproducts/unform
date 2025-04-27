<template>
  <div>
    <div class="mb-6">
      <NuxtLink :to="`/websites/${websiteId}`" class="text-bermuda-600 hover:text-bermuda-800 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to {{ website.name || 'Website' }}
      </NuxtLink>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-600 mb-6">
      {{ error }}
    </div>

    <div v-else>
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-bermuda-800 mb-1">{{ form.name }}</h1>
          <p class="text-bermuda-600">{{ responses.length }} total responses</p>
        </div>
        <button @click="showEditFormModal = true" class="btn-secondary">Edit Form</button>
      </div>

      <div class="card mb-8">
        <h2 class="text-lg font-medium text-bermuda-700 mb-4">Form Endpoint</h2>
        <div class="bg-bermuda-50 p-4 rounded-md flex items-center justify-between">
          <code class="text-sm text-bermuda-700">{{ formEndpoint }}</code>
          <div class="flex space-x-2">
            <button
              @click="showCodePreviewModal = true"
              class="text-bermuda-600 hover:text-bermuda-800 flex items-center"
              title="Preview integration code"
            >
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span>Preview Code</span>
            </button>
            <button @click="copyEndpoint" class="text-bermuda-600 hover:text-bermuda-800" title="Copy to clipboard">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-bermuda-800">Responses</h2>
        <div class="flex space-x-2">
          <button class="btn-primary" @click="exportResponses">Export CSV</button>
        </div>
      </div>

      <EmptyState v-if="responses.length === 0" icon="response" message="No responses received yet." />

      <div v-else>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-bermuda-200">
              <thead class="bg-bermuda-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-bermuda-700 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-bermuda-700 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    v-for="field in formFields"
                    :key="field"
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-bermuda-700 uppercase tracking-wider"
                  >
                    {{ field }}
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="response in responses" :key="response.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ response.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(response.createdAt) }}
                  </td>
                  <td
                    v-for="field in formFields"
                    :key="field"
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {{ response.data[field] || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button @click="viewResponseDetails(response)" class="text-bermuda-600 hover:text-bermuda-800">
                      View
                    </button>
                    <button @click="deleteResponse(response.id)" class="ml-4 text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Response Details Modal -->
      <Teleport to="body">
        <div v-if="showResponseModal" class="modal-backdrop">
          <div class="modal-content max-w-2xl w-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-gray-900">Response Details</h2>
              <button @click="showResponseModal = false" class="text-gray-400 hover:text-gray-600">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div v-if="selectedResponse" class="space-y-4">
              <div class="text-sm text-bermuda-600">
                Submitted on {{ formatDate(selectedResponse.createdAt) }} at
                {{ formatTime(selectedResponse.createdAt) }}
              </div>

              <div class="bg-bermuda-50 p-4 rounded-md overflow-auto max-h-80">
                <pre class="text-sm text-bermuda-700">{{ JSON.stringify(selectedResponse.data, null, 2) }}</pre>
              </div>
            </div>

            <div class="flex justify-end mt-6">
              <button @click="showResponseModal = false" class="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Edit Form Modal -->
      <Teleport to="body">
        <div v-if="showEditFormModal" class="modal-backdrop">
          <div class="modal-content max-w-md w-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-bermuda-800">Edit Form</h2>
              <button @click="closeEditModal" class="text-bermuda-400 hover:text-bermuda-600">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleUpdateForm" class="space-y-4">
              <div>
                <label for="edit-name" class="block text-sm font-medium text-bermuda-700">Form Name</label>
                <input id="edit-name" v-model="editFormData.name" type="text" required class="form-input" />
                <p v-if="editErrors.name" class="mt-1 text-sm text-red-600">{{ editErrors.name }}</p>
              </div>

              <div v-if="editError" class="bg-red-50 p-3 rounded text-red-600 text-sm">
                {{ editError }}
              </div>

              <div class="flex space-x-3">
                <button
                  type="button"
                  @click="confirmDelete"
                  class="btn-danger"
                  :disabled="editLoading || deleteLoading"
                >
                  <span v-if="deleteLoading">Deleting...</span>
                  <span v-else>Delete Form</span>
                </button>
                <div class="flex-grow"></div>
                <button type="button" @click="closeEditModal" class="btn-secondary" :disabled="editLoading">
                  Cancel
                </button>
                <button type="submit" class="btn-primary" :disabled="editLoading">
                  <span v-if="editLoading">Saving...</span>
                  <span v-else>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- Delete Confirmation Modal -->
      <Teleport to="body">
        <div v-if="showDeleteConfirmModal" class="modal-backdrop">
          <div class="modal-content max-w-md w-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-red-600">Delete Form</h2>
              <button @click="showDeleteConfirmModal = false" class="text-bermuda-400 hover:text-bermuda-600">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="mb-6">
              <p class="text-gray-700">
                Are you sure you want to delete this form? This action cannot be undone and will delete all responses
                associated with this form.
              </p>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showDeleteConfirmModal = false"
                class="btn-secondary"
                :disabled="deleteLoading"
              >
                Cancel
              </button>
              <button type="button" @click="handleDeleteForm" class="btn-danger" :disabled="deleteLoading">
                <span v-if="deleteLoading">Deleting...</span>
                <span v-else>Yes, Delete Form</span>
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Code Preview Modal -->
      <Teleport to="body">
        <div v-if="showCodePreviewModal" class="modal-backdrop">
          <div class="modal-content max-w-2xl w-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-bermuda-800">Integration Code</h2>
              <button @click="showCodePreviewModal = false" class="text-bermuda-400 hover:text-bermuda-600">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="bg-bermuda-50 p-4 rounded-md">
              <pre
                class="text-sm text-bermuda-700 overflow-x-auto"
              ><code>&lt;form action="{{ formEndpoint }}" method="POST"&gt;
  &lt;!-- Your form fields here --&gt;
  &lt;button type="submit"&gt;Submit&lt;/button&gt;
&lt;/form&gt;</code></pre>
            </div>

            <div class="mt-4">
              <h3 class="text-md font-semibold text-bermuda-700 mb-2">HTML Example</h3>
              <div class="bg-bermuda-50 p-4 rounded-md">
                <pre
                  class="text-sm text-bermuda-700 overflow-x-auto"
                ><code>&lt;form action="{{ formEndpoint }}" method="POST"&gt;
  &lt;div&gt;
    &lt;label for="name"&gt;Name&lt;/label&gt;
    &lt;input type="text" id="name" name="name" required&gt;
  &lt;/div&gt;
  
  &lt;div&gt;
    &lt;label for="email"&gt;Email&lt;/label&gt;
    &lt;input type="email" id="email" name="email" required&gt;
  &lt;/div&gt;
  
  &lt;div&gt;
    &lt;label for="message"&gt;Message&lt;/label&gt;
    &lt;textarea id="message" name="message" rows="4" required&gt;&lt;/textarea&gt;
  &lt;/div&gt;
  
  &lt;button type="submit"&gt;Submit&lt;/button&gt;
&lt;/form&gt;</code></pre>
              </div>
            </div>

            <div class="flex justify-end mt-6">
              <button @click="showCodePreviewModal = false" class="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWebsites } from '~/composables/websites';
import { useForms } from '~/composables/forms';
import { updateFormSchema } from '~/shared/schemas/form';

const route = useRoute();
const router = useRouter();
const websiteId = route.params.id;
const formId = route.params.formId;

// Use composables
const { getWebsite } = useWebsites();
const { getForm, updateForm, deleteForm } = useForms(websiteId);

// State management
const website = ref({});
const form = ref({});
const isLoading = ref(true);
const error = ref(null);

// Modal states
const showResponseModal = ref(false);
const showEditFormModal = ref(false);
const showDeleteConfirmModal = ref(false);
const showCodePreviewModal = ref(false);

// Edit form states
const editFormData = reactive({
  name: '',
});
const editErrors = ref({});
const editError = ref('');
const editLoading = ref(false);
const deleteLoading = ref(false);

// Response-related state
const selectedResponse = ref(null);

// In a real app, these would be fetched from an API for form responses
// Since we don't have a form responses endpoint yet, we'll use dummy data for responses
const responses = ref([
  {
    id: '1',
    formId,
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello, I would like to discuss a project!',
    },
    createdAt: '2023-09-15T14:30:00Z',
    updatedAt: '2023-09-15T14:30:00Z',
  },
  {
    id: '2',
    formId,
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      message: 'I am interested in your services.',
    },
    createdAt: '2023-09-16T10:15:00Z',
    updatedAt: '2023-09-16T10:15:00Z',
  },
  {
    id: '3',
    formId,
    data: {
      name: 'Robert Johnson',
      email: 'robert@example.com',
      message: 'Can you provide a quote for my project?',
    },
    createdAt: '2023-09-18T08:45:00Z',
    updatedAt: '2023-09-18T08:45:00Z',
  },
]);

const formEndpoint = computed(() => {
  return `https://api.unform.example/submit/${websiteId}/${formId}`;
});

// Load data on mount
onMounted(async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const [websiteData, formData] = await Promise.all([getWebsite(websiteId), getForm(formId)]);

    if (websiteData) {
      website.value = websiteData;
    }

    if (formData) {
      form.value = formData;
      // Initialize edit form with current data
      editFormData.name = formData.name;
    }
  } catch (err) {
    error.value = err.message || 'Failed to load data';
    console.error('Error loading data:', err);
  } finally {
    isLoading.value = false;
  }
});

// Extract unique fields from all responses
const formFields = computed(() => {
  const fields = new Set();
  responses.value.forEach((response) => {
    Object.keys(response.data).forEach((key) => fields.add(key));
  });
  return Array.from(fields);
});

// Edit Form Methods
function closeEditModal() {
  showEditFormModal.value = false;
  editErrors.value = {};
  editError.value = '';
  // Reset form to current form data
  if (form.value) {
    editFormData.name = form.value.name;
  }
}

async function handleUpdateForm() {
  editErrors.value = {};
  editError.value = '';
  editLoading.value = true;

  try {
    // Validate form data
    updateFormSchema.parse(editFormData);

    // Submit to API
    const updated = await updateForm(formId, editFormData);
    if (updated) {
      form.value = updated;
      showEditFormModal.value = false;
    }
  } catch (error) {
    // Handle validation errors
    if (error.errors) {
      error.errors.forEach((err) => {
        if (err.path && err.path.length > 0) {
          editErrors.value[err.path[0]] = err.message;
        }
      });
    } else {
      editError.value = error.message || 'Failed to update form. Please try again.';
    }
  } finally {
    editLoading.value = false;
  }
}

function confirmDelete() {
  showDeleteConfirmModal.value = true;
}

async function handleDeleteForm() {
  deleteLoading.value = true;
  try {
    await deleteForm(formId);
    router.push(`/websites/${websiteId}`);
  } catch (error) {
    // Show error in the edit modal
    editError.value = error.message || 'Failed to delete form. Please try again.';
    showDeleteConfirmModal.value = false;
  } finally {
    deleteLoading.value = false;
  }
}

// Response-related methods
function viewResponseDetails(response) {
  selectedResponse.value = response;
  showResponseModal.value = true;
}

function deleteResponse(id) {
  // In a real app, this would send a request to the backend
  const index = responses.value.findIndex((response) => response.id === id);
  if (index !== -1) {
    responses.value.splice(index, 1);
  }
}

function exportResponses() {
  // In a real app, this would generate and download a CSV file
  alert('Exporting responses as CSV...');
}

function copyEndpoint() {
  // In a real app, this would copy the endpoint to the clipboard
  alert(`Copied to clipboard: ${formEndpoint.value}`);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString();
}
</script>

<style scoped>
.card {
  @apply p-6 bg-white rounded-lg shadow-md;
}

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

.btn-danger {
  @apply px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500;
}

.spinner {
  @apply h-8 w-8 rounded-full border-4 border-bermuda-200 border-t-bermuda-600 animate-spin;
}
</style>
