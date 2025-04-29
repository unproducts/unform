<template>
  <div>
    <div class="mb-6">
      <NuxtLink :to="`/forms/${formId}`" class="text-bermuda-600 hover:text-bermuda-800 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to responses
      </NuxtLink>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="spinner"></div>
    </div>

    <div v-else-if="formError" class="bg-red-50 p-4 rounded-md text-red-600 mb-6">
      {{ formError }}
    </div>

    <div v-else>
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-bermuda-800 mb-1">{{ form?.name }}</h1>
        <p class="text-bermuda-600">Form Preferences</p>
      </div>

      <div class="card mb-8">
        <h2 class="text-lg font-medium text-bermuda-700 mb-4">Details</h2>
        <div class="space-y-4">
          <div>
            <label for="form-name" class="block text-sm font-medium text-bermuda-700">Form Name</label>
            <div class="mt-1 flex items-center gap-2">
              <input
                id="form-name"
                v-model="editFormData.name"
                type="text"
                class="form-input flex-grow"
                placeholder="Enter form name"
              />
              <button @click="handleUpdateForm" class="btn-primary" :disabled="editLoading">
                <span v-if="editLoading">Saving...</span>
                <span v-else>Save</span>
              </button>
            </div>
            <p v-if="editErrors.name" class="mt-1 text-sm text-red-600">{{ editErrors.name }}</p>
          </div>
        </div>
      </div>

      <div class="card mb-8">
        <h2 class="text-lg font-medium text-bermuda-700 mb-4">Allowed Domains</h2>
        <div class="space-y-4">
          <div v-if="domainsError" class="bg-red-50 p-3 rounded text-red-600 text-sm">
            {{ domainsError }}
          </div>

          <div v-for="domain in domains" :key="domain.id" class="flex items-center gap-2">
            <input :value="domain.domain" type="text" class="form-input flex-grow" disabled />
            <div class="flex items-center gap-1">
              <button
                v-if="editingDomain?.id === domain.id"
                class="text-bermuda-600 hover:text-bermuda-800 p-2"
                title="Save domain"
                :disabled="domainsLoading"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                v-if="editingDomain?.id !== domain.id"
                @click="handleRemoveDomain(domain.id)"
                class="text-red-600 hover:text-red-800 p-2"
                title="Remove domain"
                :disabled="domainsLoading"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="newDomain"
              type="text"
              class="form-input flex-grow"
              placeholder="Enter domain (e.g., example.com)"
              @keyup.enter="handleAddDomain"
            />
            <button
              @click="handleAddDomain"
              class="text-bermuda-600 hover:text-bermuda-800 p-2"
              title="Add domain"
              :disabled="domainsLoading || !newDomain.trim()"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="card border border-red-200 bg-red-50">
        <h2 class="text-lg font-medium text-red-700 mb-4">Danger Zone</h2>
        <div class="space-y-4">
          <div>
            <p class="text-red-600 mb-4">Once you delete a form, there is no going back. Please be certain.</p>
            <button @click="confirmDelete" class="btn-danger" :disabled="deleteLoading">
              <span v-if="deleteLoading">Deleting...</span>
              <span v-else>Delete Form</span>
            </button>
          </div>
        </div>
      </div>

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
    </div>
  </div>
</template>

<script setup lang="ts">
import { updateFormSchema, type Form } from '~~/shared/schemas/form';

const route = useRoute();
const router = useRouter();
const formId = route.params.formId as string;

const { getForm, updateForm, deleteForm, isLoading: formLoading, error: formError } = useForms();
const {
  domains,
  isLoading: domainsLoading,
  error: domainsError,
  fetchDomains,
  addDomain,
  deleteDomain,
} = useFormDomains(formId);

const form = ref<Form | null>(null);
const newDomain = ref('');
const editingDomain = ref<{ id: string; value: string } | null>(null);

const isLoading = computed(() => formLoading.value || domainsLoading.value);

const editFormData = reactive({
  name: '',
});
const editErrors = ref<Record<string, string>>({});
const editError = ref('');
const editLoading = ref(false);
const deleteLoading = ref(false);
const showDeleteConfirmModal = ref(false);

getForm(formId).then((formData) => {
  if (formData) {
    form.value = formData;
    editFormData.name = formData.name;
  }
});

fetchDomains();

async function handleAddDomain() {
  if (!newDomain.value.trim()) return;

  await addDomain(newDomain.value.trim());
  newDomain.value = '';
}

async function handleRemoveDomain(domainId: string) {
  await deleteDomain(domainId);
}

async function handleUpdateForm() {
  editErrors.value = {};
  editError.value = '';
  editLoading.value = true;

  try {
    updateFormSchema.parse(editFormData);
    const updated = await updateForm(formId, editFormData);
    if (updated) {
      form.value = updated;
    }
  } catch (error: any) {
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
  await deleteForm(formId);
  router.push(`/forms`);
  showDeleteConfirmModal.value = false;
}
</script>
