<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/websites" class="text-bermuda-600 hover:text-bermuda-800 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to websites
      </NuxtLink>
    </div>

    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-bermuda-800">{{ website.name }}</h1>
        <p class="text-bermuda-600">{{ website.domain }}</p>
      </div>
      <button @click="showAddFormModal = true" class="btn-primary">Create New Form</button>
    </div>

    <div class="card mb-8">
      <h2 class="text-lg font-medium text-bermuda-700 mb-4">Integration Code</h2>
      <div class="bg-bermuda-50 p-4 rounded-md">
        <pre
          class="text-sm text-bermuda-700 overflow-x-auto"
        ><code>&lt;form action="{{ formEndpoint }}" method="POST"&gt;
  &lt;!-- Your form fields here --&gt;
  &lt;button type="submit"&gt;Submit&lt;/button&gt;
&lt;/form&gt;</code></pre>
      </div>
    </div>

    <div class="mb-4">
      <h2 class="text-xl font-bold text-bermuda-800 mb-4">Forms</h2>
    </div>

    <EmptyState
      v-if="forms.length === 0"
      icon="form"
      message="No forms created yet. Create your first form to get started."
      actionLabel="Create Form"
      :actionClick="() => (showAddFormModal = true)"
    />

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="form in forms"
        :key="form.id"
        :to="`/websites/${website.id}/forms/${form.id}`"
        class="card hover:shadow-lg transition-shadow duration-200"
      >
        <h3 class="text-lg font-semibold text-bermuda-700 mb-2">{{ form.name }}</h3>
        <div class="flex justify-between items-center">
          <div class="text-sm text-bermuda-600">{{ form.responseCount }} responses</div>
          <div class="text-sm text-bermuda-500">Created {{ form.createdAt }}</div>
        </div>
      </NuxtLink>
    </div>

    <!-- Add Form Modal -->
    <Teleport to="body">
      <div v-if="showAddFormModal" class="modal-backdrop">
        <div class="modal-content max-w-md w-full">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-bermuda-800">Create New Form</h2>
            <button @click="showAddFormModal = false" class="text-bermuda-400 hover:text-bermuda-600">
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="addForm" class="space-y-4">
            <div>
              <label for="form-name" class="block text-sm font-medium text-bermuda-700">Form Name</label>
              <input id="form-name" v-model="newForm.name" type="text" required class="form-input" />
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="showAddFormModal = false" class="btn-secondary">Cancel</button>
              <button type="submit" class="btn-primary">Create Form</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
const route = useRoute();
const websiteId = route.params.id;

// In a real app, these would be fetched from the backend
const website = ref({
  id: websiteId,
  name: 'My Portfolio',
  domain: 'https://portfolio.example.com',
});

const forms = ref([
  { id: '1', name: 'Contact Form', responseCount: 12, createdAt: '2023-05-10' },
  { id: '2', name: 'Newsletter Signup', responseCount: 45, createdAt: '2023-06-22' },
]);

const formEndpoint = computed(() => {
  return `https://api.unform.example/submit/${websiteId}`;
});

const showAddFormModal = ref(false);
const newForm = reactive({
  name: '',
});

function addForm() {
  // In a real app, this would send a request to the backend
  const id = (forms.value.length + 1).toString();
  forms.value.push({
    id,
    name: newForm.name,
    responseCount: 0,
    createdAt: new Date().toISOString().split('T')[0],
  });

  // Reset form and close modal
  newForm.name = '';
  showAddFormModal.value = false;
}
</script>
