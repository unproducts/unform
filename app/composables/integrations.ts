import { ref } from 'vue';
import type { Integration } from '~~/shared/schemas/integration';
import { createIntegrationSchema, updateIntegrationSchema } from '~~/shared/schemas/integration';

export const useIntegrations = () => {
  const integrations = ref<Integration[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all integrations
  const fetchIntegrations = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch<Integration[]>('/api/integrations');
      integrations.value = response;
    } catch (err) {
      console.error('Failed to fetch integrations:', err);
      error.value = 'Failed to fetch integrations';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Create a new integration
  const createIntegration = async (integration: Zod.infer<typeof createIntegrationSchema>) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Validate the integration data
      createIntegrationSchema.parse(integration);

      // Submit to API
      const createdIntegration = await $fetch<Integration>('/api/integrations', {
        method: 'POST',
        body: integration,
      });

      // Add to local list
      integrations.value.push(createdIntegration);

      return createdIntegration;
    } catch (err) {
      console.error('Failed to create integration:', err);
      error.value = 'Failed to create integration';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Update an existing integration
  const updateIntegration = async (integrationId: string, updateQuery: Zod.infer<typeof updateIntegrationSchema>) => {
    if (!integrationId) {
      throw new Error('Integration ID is required for update');
    }

    isLoading.value = true;
    error.value = null;

    try {
      // Validate the integration data
      updateIntegrationSchema.parse(updateQuery);

      // Submit to API
      const updatedIntegration = await $fetch<Integration>(`/api/integrations/${integrationId}`, {
        method: 'PUT',
        body: updateQuery,
      });

      // Update in local list
      const index = integrations.value.findIndex((i) => i.id === integrationId);
      if (index !== -1) {
        integrations.value[index] = updatedIntegration;
      }

      return updatedIntegration;
    } catch (err) {
      console.error('Failed to update integration:', err);
      error.value = 'Failed to update integration';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete an integration
  const deleteIntegration = async (integrationId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/integrations/${integrationId}`, {
        method: 'DELETE',
      });

      // Remove from local list
      integrations.value = integrations.value.filter((i) => i.id !== integrationId);
    } catch (err) {
      console.error('Failed to delete integration:', err);
      error.value = 'Failed to delete integration';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Get a single integration by ID
  const getIntegration = async (integrationId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      return await $fetch<Integration>(`/api/integrations/${integrationId}`);
    } catch (err) {
      console.error(`Failed to get integration ${integrationId}:`, err);
      error.value = `Failed to get integration ${integrationId}`;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    integrations,
    isLoading,
    error,
    fetchIntegrations,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    getIntegration,
  };
};
