<template>
  <div>
    <div class="mb-6">
      <NuxtLink :to="`/forms`" class="text-bermuda-600 hover:text-bermuda-800 flex items-center">
        <Icon name="si:arrow-left-line" class="w-6 h-6 mr-1" />
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
              <Icon name="code" class="w-5 h-5 mr-1" />
              <span>Preview Code</span>
            </button>
            <button @click="copyEndpoint" class="text-bermuda-600 hover:text-bermuda-800" title="Copy to clipboard">
              <Icon name="clipboard" class="w-5 h-5" />
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
                  <th scope="col" class="max-w-32">ID</th>
                  <th scope="col" class="max-w-32">Date</th>
                  <th v-for="field in formFields" :key="field" scope="col" class="max-w-xs">
                    {{ field }}
                  </th>
                  <th scope="col" class="text-right max-w-32">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="response in responses" :key="response.id">
                  <td class="truncate max-w-32" :title="response.id">{{ response.id }}</td>
                  <td class="truncate max-w-32" :title="formatTime(response.createdAt)">{{ formatTime(response.createdAt) }}</td>
                  <td
                    v-for="field in formFields"
                    :key="field"
                    class="truncate max-w-xs"
                    :title="getFieldValue(response, field)"
                  >
                    {{ getFieldValue(response, field) }}
                  </td>
                  <td class="text-right max-w-32">
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
      <ResponseModal v-model="showResponseModal" :response="selectedResponse" />
      <CodePreviewModal v-model="showCodePreviewModal" :form="form" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useForms } from '~/composables/forms';
import { useFormResponses } from '~/composables/form-responses';
import { type Form, type FormResponse } from '~~/shared/schemas/form';

const route = useRoute();
const formId = route.params.formId as string;

const config = useRuntimeConfig();
const host = config.public.host;

// Use composables
const { getForm } = useForms();
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
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);

// Modal states
const showResponseModal = ref<boolean>(false);
const showCodePreviewModal = ref<boolean>(false);
const deleteResponseLoading = ref<boolean>(false);

// Response-related state
const selectedResponse = ref<FormResponse | null>(null);

const formEndpoint = computed<string>(() => {
  return `${host}/collect/${formId}`;
});

// Load data on mount
isLoading.value = true;
error.value = null;

try {
  const formData = await getForm(formId);
  if (formData) {
    form.value = formData;
  }

  await fetchResponses();
} catch (err: any) {
  error.value = err.message || 'Failed to load data';
  console.error('Error loading data:', err);
} finally {
  isLoading.value = false;
}

// Extract unique fields from all responses
const formFields = computed<string[]>(() => {
  const fields = new Set<string>();
  responses.value.forEach((response) => {
    if (response.data && typeof response.data === 'object') {
      Object.keys(response.data).forEach((key) => fields.add(key));
    }
  });
  return Array.from(fields);
});

// Response-related methods
function viewResponseDetails(response: FormResponse): void {
  selectedResponse.value = response;
  showResponseModal.value = true;
}

async function deleteResponse(id: string): Promise<void> {
  deleteResponseLoading.value = true;
  try {
    await apiDeleteResponse(id);
  } catch (error: any) {
    console.error(`Error deleting response ${id}:`, error);
  } finally {
    deleteResponseLoading.value = false;
  }
}

function exportResponses(): void {
  const csvContent = exportResponsesAsCSV();
  if (!csvContent) {
    return;
  }

  // Create blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${form.value.name}-responses-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function copyEndpoint(): void {
  navigator.clipboard.writeText(formEndpoint.value);
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString();
}

function getFieldValue(response: FormResponse, field: string): string {
  const value = response.data && response.data[field];
  if (value === null || value === undefined) {
    return '-';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
</script>
