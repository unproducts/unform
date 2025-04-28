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

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-600 mb-6">
      {{ error }}
      <button @click="loadWebsite" class="text-red-700 underline ml-2">Try again</button>
    </div>

    <template v-else-if="website">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-bermuda-800">{{ website.name }}</h1>
          <p class="text-bermuda-600">{{ website.domain }}</p>
        </div>
        <div class="flex space-x-3">
          <button @click="showEditWebsiteModal = true" class="btn-secondary" :disabled="isLoading">Edit Website</button>
          <button @click="showAddFormModal = true" class="btn-primary" :disabled="isLoading || formLoading">
            Create New Form
          </button>
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

      <div v-else class="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="form in forms"
          :key="form.id"
          :to="`/websites/${website.id}/forms/${form.id}`"
          class="card hover:shadow-lg transition-shadow duration-200"
        >
          <h3 class="text-base md:text-lg font-semibold text-bermuda-700 mb-2">{{ form.name }}</h3>
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div class="text-xs md:text-sm text-bermuda-600">{{ new Date(form.createdAt).toLocaleDateString() }}</div>
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
              <span class="text-xs md:text-sm">View Responses</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Edit Website Modal -->
      <Teleport to="body">
        <div v-if="showEditWebsiteModal" class="modal-backdrop">
          <div class="modal-content max-w-md w-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-bermuda-800">Edit Website</h2>
              <button @click="closeEditModal" class="text-bermuda-400 hover:text-bermuda-600">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleUpdateWebsite" class="space-y-4">
              <div>
                <label for="edit-name" class="block text-sm font-medium text-bermuda-700">Website Name</label>
                <input id="edit-name" v-model="editWebsiteData.name" type="text" required class="form-input" />
                <p v-if="editErrors.name" class="mt-1 text-sm text-red-600">{{ editErrors.name }}</p>
              </div>

              <div>
                <label for="edit-domain" class="block text-sm font-medium text-bermuda-700">Domain</label>
                <input
                  id="edit-domain"
                  v-model="editWebsiteData.domain"
                  type="url"
                  required
                  placeholder="https://example.com"
                  class="form-input"
                />
                <p v-if="editErrors.domain" class="mt-1 text-sm text-red-600">{{ editErrors.domain }}</p>
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
                  <span v-else>Delete Website</span>
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

      <!-- Add Form Modal -->
      <Teleport to="body">
        <div v-if="showAddFormModal" class="modal-backdrop">
          <div class="modal-content max-w-md w-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-bermuda-800">Create New Form</h2>
              <button
                @click="showAddFormModal = false"
                class="text-bermuda-400 hover:text-bermuda-600"
                :disabled="formLoading"
              >
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
                <button type="button" @click="showAddFormModal = false" class="btn-secondary" :disabled="formLoading">
                  Cancel
                </button>
                <button type="submit" class="btn-primary" :disabled="formLoading">
                  <span v-if="formLoading">Creating...</span>
                  <span v-else>Create Form</span>
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
              <h2 class="text-xl font-bold text-red-600">Delete Website</h2>
              <button @click="showDeleteConfirmModal = false" class="text-bermuda-400 hover:text-bermuda-600">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="mb-6">
              <p class="text-gray-700">
                Are you sure you want to delete this website? This action cannot be undone and will delete all forms and
                submissions associated with this website.
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
              <button type="button" @click="handleDeleteWebsite" class="btn-danger" :disabled="deleteLoading">
                <span v-if="deleteLoading">Deleting...</span>
                <span v-else>Yes, Delete Website</span>
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </template>
  </div>
</template>

<script setup lang="ts">
import { updateWebsiteSchema, type Website } from '~~/shared/schemas/website';

const route = useRoute();
const router = useRouter();
const websiteId = route.params.id as string;
const { isLoading, error, getWebsite, updateWebsite, deleteWebsite } = useWebsites();
const { forms, isLoading: formsLoading, error: formsError, fetchForms, createForm } = useForms(websiteId);

const website = ref<Website | null>(null);

// Modal states
const showAddFormModal = ref(false);
const showEditWebsiteModal = ref(false);
const showDeleteConfirmModal = ref(false);

// Form states
const newForm = reactive({
  name: '',
});
const formLoading = ref(false);

const editWebsiteData = reactive({
  name: '',
  domain: '',
});

const editErrors = ref<Record<string, string>>({});
const editError = ref('');
const editLoading = ref(false);
const deleteLoading = ref(false);

// Load website data
async function loadWebsite() {
  const data = await getWebsite(websiteId);
  if (data) {
    website.value = data;
    // Initialize edit form with current data
    editWebsiteData.name = data.name;
    editWebsiteData.domain = data.domain;
  }
}

// Initialize data on page load
onMounted(async () => {
  await loadWebsite();
  await fetchForms();
});

function closeEditModal() {
  showEditWebsiteModal.value = false;
  editErrors.value = {};
  editError.value = '';
  // Reset form to current website data
  if (website.value) {
    editWebsiteData.name = website.value.name;
    editWebsiteData.domain = website.value.domain;
  }
}

async function handleUpdateWebsite() {
  editErrors.value = {};
  editError.value = '';
  editLoading.value = true;

  try {
    // Validate form data
    updateWebsiteSchema.parse(editWebsiteData);

    // Submit to API
    const updated = await updateWebsite(websiteId, editWebsiteData);
    if (updated) {
      website.value = updated;
      showEditWebsiteModal.value = false;
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
      editError.value = error.message || 'Failed to update website. Please try again.';
    }
  } finally {
    editLoading.value = false;
  }
}

function confirmDelete() {
  showDeleteConfirmModal.value = true;
}

async function handleDeleteWebsite() {
  deleteLoading.value = true;
  try {
    await deleteWebsite(websiteId);
    router.push('/websites');
  } catch (error: any) {
    // Show error in the edit modal
    editError.value = error.message || 'Failed to delete website. Please try again.';
    showDeleteConfirmModal.value = false;
  } finally {
    deleteLoading.value = false;
  }
}

async function addForm() {
  formLoading.value = true;
  try {
    await createForm(newForm);
    // Reset form and close modal
    newForm.name = '';
    showAddFormModal.value = false;
  } catch (error: any) {
    console.error('Failed to create form:', error);
  } finally {
    formLoading.value = false;
  }
}
</script>
