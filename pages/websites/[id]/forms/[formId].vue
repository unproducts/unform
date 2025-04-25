<template>
  <div>
    <div class="mb-6">
      <NuxtLink :to="`/websites/${websiteId}`" class="text-bermuda-600 hover:text-bermuda-800 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to {{ website.name }}
      </NuxtLink>
    </div>

    <div class="mb-8">
      <h1 class="text-2xl font-bold text-bermuda-800 mb-1">{{ form.name }}</h1>
      <p class="text-bermuda-600">{{ responses.length }} total responses</p>
    </div>

    <div class="card mb-8">
      <h2 class="text-lg font-medium text-bermuda-700 mb-4">Form Endpoint</h2>
      <div class="bg-bermuda-50 p-4 rounded-md flex items-center justify-between">
        <code class="text-sm text-bermuda-700">{{ formEndpoint }}</code>
        <button @click="copyEndpoint" class="ml-2 text-bermuda-600 hover:text-bermuda-800" title="Copy to clipboard">
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
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                <td v-for="field in formFields" :key="field" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
              Submitted on {{ formatDate(selectedResponse.createdAt) }} at {{ formatTime(selectedResponse.createdAt) }}
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
  </div>
</template>

<script setup>
const route = useRoute();
const websiteId = route.params.id;
const formId = route.params.formId;

// In a real app, these would be fetched from the backend
const website = ref({
  id: websiteId,
  name: 'My Portfolio',
  domain: 'https://portfolio.example.com',
});

const form = ref({
  id: formId,
  name: 'Contact Form',
  websiteId,
});

const formEndpoint = computed(() => {
  return `https://api.unform.example/submit/${websiteId}/${formId}`;
});

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

// Extract unique fields from all responses
const formFields = computed(() => {
  const fields = new Set();
  responses.value.forEach((response) => {
    Object.keys(response.data).forEach((key) => fields.add(key));
  });
  return Array.from(fields);
});

const showResponseModal = ref(false);
const selectedResponse = ref(null);

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
