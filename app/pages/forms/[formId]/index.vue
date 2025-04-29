<template>
  <div>
    <div class="mb-6">
      <NuxtLink :to="`/forms`" class="text-bermuda-600 hover:text-bermuda-800 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Forms
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
        <NuxtLink :to="`/forms/${formId}/preferences`" class="btn-secondary"> Preferences </NuxtLink>
      </div>

      <div class="card mb-8">
        <h2 class="text-lg font-medium text-bermuda-700 mb-4">Form Endpoint</h2>
        <div
          class="bg-bermuda-50 p-4 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <code class="text-sm text-bermuda-700 break-all">{{ formEndpoint }}</code>
          <div class="flex space-x-2">
            <button
              @click="showCodePreviewModal = true"
              class="text-bermuda-600 hover:text-bermuda-800 flex items-center hidden sm:flex"
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
          <button class="btn-primary" @click="exportResponses" :disabled="isLoading || responsesLoading">
            Export CSV
          </button>
        </div>
      </div>

      <div v-if="responsesLoading" class="flex justify-center py-8">
        <div class="spinner"></div>
      </div>

      <div v-else-if="responsesError" class="bg-red-50 p-4 rounded-md text-red-600 mb-6">
        {{ responsesError }}
        <button @click="fetchResponses" class="text-red-700 underline ml-2">Try again</button>
      </div>

      <EmptyState v-else-if="responses.length === 0" icon="response" message="No responses received yet." />

      <div v-else>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="table-container">
            <table class="table">
              <thead class="bg-bermuda-50">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Date</th>
                  <th v-for="field in formFields" :key="field" scope="col">
                    {{ field }}
                  </th>
                  <th scope="col" class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="response in responses" :key="response.id">
                  <td>{{ response.id }}</td>
                  <td>{{ formatDate(response.createdAt) }}</td>
                  <td v-for="field in formFields" :key="field">
                    {{ (response.data && response.data[field]) || '-' }}
                  </td>
                  <td class="text-right">
                    <div class="flex justify-end space-x-2">
                      <button @click="viewResponseDetails(response)" class="text-bermuda-600 hover:text-bermuda-800">
                        View
                      </button>
                      <button
                        @click="deleteResponse(response.id)"
                        class="text-red-600 hover:text-red-900"
                        :disabled="deleteResponseLoading"
                      >
                        Delete
                      </button>
                    </div>
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
              <button @click="closeEditModal" class="text-bermuda-400 hover:text-bermuda-600" :disabled="editLoading">
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
              <button
                @click="showDeleteConfirmModal = false"
                class="text-bermuda-400 hover:text-bermuda-600"
                :disabled="deleteLoading"
              >
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

<script setup lang="ts">
import { onMounted, ref, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useForms } from '~/composables/forms';
import { useFormResponses } from '~/composables/form-responses';
import { updateFormSchema, type Form } from '~~/shared/schemas/form';

const route = useRoute();
const router = useRouter();
const formId = route.params.formId as string;

const config = useRuntimeConfig();
const host = config.public.host;

// Use composables
const { getForm, updateForm, deleteForm } = useForms();
const {
  responses,
  isLoading: responsesLoading,
  error: responsesError,
  fetchResponses,
  deleteResponse: apiDeleteResponse,
  exportResponsesAsCSV,
} = useFormResponses(formId);

// State management
const form = ref<Form>({} as Form);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Modal states
const showResponseModal = ref(false);
const showEditFormModal = ref(false);
const showDeleteConfirmModal = ref(false);
const showCodePreviewModal = ref(false);
const deleteResponseLoading = ref(false);

// Edit form states
const editFormData = reactive({
  name: '',
});
const editErrors = ref<Record<string, string>>({});
const editError = ref('');
const editLoading = ref(false);
const deleteLoading = ref(false);

// Response-related state
const selectedResponse = ref<any>(null);

const formEndpoint = computed(() => {
  return `${host}/forms/${formId}`;
});

// Load data on mount
isLoading.value = true;
error.value = null;

try {
  const formData = await getForm(formId);
  if (formData) {
    form.value = formData;
    editFormData.name = formData.name;
  }

  await fetchResponses();
} catch (err: any) {
  error.value = err.message || 'Failed to load data';
  console.error('Error loading data:', err);
} finally {
  isLoading.value = false;
}

// Extract unique fields from all responses
const formFields = computed(() => {
  const fields = new Set<string>();
  responses.value.forEach((response) => {
    if (response.data && typeof response.data === 'object') {
      Object.keys(response.data).forEach((key) => fields.add(key));
    }
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
  } catch (error: any) {
    // Handle validation errors
    if (error.errors) {
      error.errors.forEach((err: any) => {
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
    router.push(`/forms`);
  } catch (error: any) {
    // Show error in the edit modal
    editError.value = error.message || 'Failed to delete form. Please try again.';
    showDeleteConfirmModal.value = false;
  } finally {
    deleteLoading.value = false;
  }
}

// Response-related methods
function viewResponseDetails(response: any) {
  selectedResponse.value = response;
  showResponseModal.value = true;
}

async function deleteResponse(id: string) {
  deleteResponseLoading.value = true;
  try {
    await apiDeleteResponse(id);
  } catch (error: any) {
    console.error(`Error deleting response ${id}:`, error);
  } finally {
    deleteResponseLoading.value = false;
  }
}

function exportResponses() {
  const data = exportResponsesAsCSV();
  // In a real implementation, this would generate and download a CSV file
  alert(`Exporting ${data.length} responses as CSV...`);
}

function copyEndpoint() {
  navigator.clipboard.writeText(formEndpoint.value);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString();
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString();
}
</script>
