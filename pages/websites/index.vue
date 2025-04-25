<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-bermuda-800">Your Websites</h1>
      <button @click="showAddWebsiteModal = true" class="btn-primary">Add Website</button>
    </div>

    <EmptyState
      v-if="websites.length === 0"
      icon="website"
      message="You don't have any websites yet. Add your first website to get started."
      actionLabel="Add Website"
      :actionClick="() => (showAddWebsiteModal = true)"
    />

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="website in websites"
        :key="website.id"
        :to="`/websites/${website.id}`"
        class="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
      >
        <h2 class="text-xl font-semibold text-bermuda-700 mb-2">{{ website.name }}</h2>
        <p class="text-bermuda-600 text-sm mb-3">{{ website.domain }}</p>
        <div class="flex justify-between items-center">
          <div class="text-sm text-bermuda-500">{{ website.formCount }} forms</div>
          <button class="text-bermuda-600 hover:text-bermuda-800">Manage</button>
        </div>
      </NuxtLink>
    </div>

    <!-- Add Website Modal -->
    <Teleport to="body">
      <div v-if="showAddWebsiteModal" class="modal-backdrop">
        <div class="modal-content max-w-md w-full">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-bermuda-800">Add New Website</h2>
            <button @click="showAddWebsiteModal = false" class="text-bermuda-400 hover:text-bermuda-600">
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
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="showAddWebsiteModal = false" class="btn-secondary">Cancel</button>
              <button type="submit" class="btn-primary">Add Website</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
const websites = ref([
  { id: '1', name: 'My Portfolio', domain: 'https://portfolio.example.com', formCount: 2 },
  { id: '2', name: 'Client Project', domain: 'https://client.example.com', formCount: 1 },
  { id: '3', name: 'E-commerce Store', domain: 'https://store.example.com', formCount: 3 },
]);

const showAddWebsiteModal = ref(false);
const newWebsite = reactive({
  name: '',
  domain: '',
});

function addWebsite() {
  // In a real app, this would send a request to the backend
  const id = (websites.value.length + 1).toString();
  websites.value.push({
    id,
    name: newWebsite.name,
    domain: newWebsite.domain,
    formCount: 0,
  });

  // Reset form and close modal
  newWebsite.name = '';
  newWebsite.domain = '';
  showAddWebsiteModal.value = false;
}
</script>
