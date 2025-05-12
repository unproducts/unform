<template>
  <Card title="Connected Integrations">
    <div class="space-y-4">
      <div v-if="error" class="bg-red-50 p-3 rounded text-red-600 text-sm">
        {{ error }}
      </div>
      <div class="flex items-center space-x-2" v-for="integration in formIntegrations" :key="integration.id">
        <div class="flex-grow flex items-center space-x-2">
          <Icon :name="getIntegrationIcon(integration.integrationId)" class="w-5 h-5 text-gray-500" />
          <span class="text-gray-700">{{ getIntegrationName(integration.integrationId) }}</span>
        </div>
        <button
          @click="showDeleteConfirm(integration)"
          class="btn-danger flex items-center justify-center"
          title="Remove integration"
          :disabled="disabled"
        >
          <Icon name="mdi:trash-can" class="w-5 h-5" />
        </button>
      </div>
      <div class="flex items-center gap-2">
        <select
          v-model="selectedIntegrationId"
          class="form-input flex-grow"
          :disabled="disabled || !availableIntegrations.length"
        >
          <option value="" disabled>Select an integration</option>
          <option v-for="integration in availableIntegrations" :key="integration.id" :value="integration.id">
            {{ integration.name }}
          </option>
        </select>
        <button
          @click="handleAddIntegration"
          class="btn-secondary flex items-center justify-center"
          title="Add integration"
          :disabled="disabled || !selectedIntegrationId"
        >
          <Icon name="mdi:plus" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </Card>

  <ConfirmationModal
    v-model="showDeleteModal"
    title="Remove Integration"
    :message="deleteConfirmMessage"
    confirm-text="Yes, Remove Integration"
    loading-text="Removing..."
    :loading="isLoading"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import type { Form } from '~~/shared/schemas/form';
import type { FormIntegration } from '~~/shared/schemas/form';
import { getIntegrationType } from '~~/shared/consts/integrations';

const props = defineProps<{
  form: Form;
}>();

const {
  integrations: formIntegrations,
  isLoading,
  error,
  addIntegration,
  removeIntegration,
  fetchIntegrations,
} = useFormIntegrations(props.form.id);
const { integrations: availableIntegrationsList, fetchIntegrations: fetchAvailableIntegrations } = useIntegrations();

// Fetch both form integrations and available integrations
fetchIntegrations();
fetchAvailableIntegrations();

const selectedIntegrationId = ref('');
const showDeleteModal = ref(false);
const integrationToDelete = ref<FormIntegration | null>(null);

// Helper functions
const getIntegrationIcon = (integrationId: string) => {
  const integration = availableIntegrationsList.value.find((i) => i.id === integrationId);
  if (!integration) return 'material-symbols:integration-instructions';
  const type = getIntegrationType(integration.type);
  return type?.icon || 'material-symbols:integration-instructions';
};

const getIntegrationName = (integrationId: string) => {
  const integration = availableIntegrationsList.value.find((i) => i.id === integrationId);
  if (!integration) return 'Unknown Integration';
  const type = getIntegrationType(integration.type);
  return integration.name || type?.name || 'Unknown Integration';
};

// Compute available integrations (those not already added to the form)
const availableIntegrations = computed(() => {
  const addedIntegrationIds = new Set(formIntegrations.value.map((i) => i.integrationId));
  return availableIntegrationsList.value.filter((i) => !addedIntegrationIds.has(i.id));
});

const disabled = computed(() => isLoading.value || !!error.value);

const deleteConfirmMessage = computed(() => {
  if (!integrationToDelete.value) return '';
  const name = getIntegrationName(integrationToDelete.value.integrationId);
  return `Are you sure you want to remove the "${name}" integration? This will stop sending form submissions to this integration.`;
});

const showDeleteConfirm = (integration: FormIntegration) => {
  if (disabled.value) return;
  integrationToDelete.value = integration;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!integrationToDelete.value) return;
  await removeIntegration(integrationToDelete.value);
  showDeleteModal.value = false;
  integrationToDelete.value = null;
};

const handleAddIntegration = async () => {
  if (disabled.value || !selectedIntegrationId.value) return;
  await addIntegration(selectedIntegrationId.value);
  selectedIntegrationId.value = '';
};
</script>
