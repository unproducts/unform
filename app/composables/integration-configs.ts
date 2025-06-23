import { ref } from 'vue';
import type { IntegrationConfig } from '~~/shared/schemas/integration';
import { createIntegrationConfigSchema, updateIntegrationConfigSchema } from '~~/shared/schemas/integration';

export const useIntegrationConfigs = () => {
  const integrationConfigs = ref<IntegrationConfig[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all integrations
  const fetchIntegrationConfigs = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch<IntegrationConfig[]>('/api/integrations');
      integrationConfigs.value = response;
    } catch (err) {
      console.error('Failed to fetch integrations:', err);
      error.value = 'Failed to fetch integrations';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Create a new integration
  const createIntegrationConfig = async (integrationConfig: Zod.infer<typeof createIntegrationConfigSchema>) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Validate the integration data
      createIntegrationConfigSchema.parse(integrationConfig);

      // Submit to API
      const createdIntegrationConfig = await $fetch<IntegrationConfig>('/api/integrations', {
        method: 'POST',
        body: integrationConfig,
      });

      // Add to local list
      integrationConfigs.value.push(createdIntegrationConfig);

      return createdIntegrationConfig;
    } catch (err) {
      console.error('Failed to create integration config:', err);
      error.value = 'Failed to create integration config';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Update an existing integration
  const updateIntegrationConfig = async (
    integrationId: string,
    updateQuery: Zod.infer<typeof updateIntegrationConfigSchema>
  ) => {
    if (!integrationId) {
      throw new Error('Integration ID is required for update');
    }

    isLoading.value = true;
    error.value = null;

    try {
      // Validate the integration data
      updateIntegrationConfigSchema.parse(updateQuery);

      // Submit to API
      const updatedIntegrationConfig = await $fetch<IntegrationConfig>(`/api/integrations/${integrationId}`, {
        method: 'PUT',
        body: updateQuery,
      });

      // Update in local list
      const index = integrationConfigs.value.findIndex((i) => i.id === integrationId);
      if (index !== -1) {
        integrationConfigs.value[index] = updatedIntegrationConfig;
      }

      return updatedIntegrationConfig;
    } catch (err) {
      console.error('Failed to update integration config:', err);
      error.value = 'Failed to update integration config';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete an integration
  const deleteIntegrationConfig = async (integrationId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/integrations/${integrationId}`, {
        method: 'DELETE',
      });

      // Remove from local list
      integrationConfigs.value = integrationConfigs.value.filter((i) => i.id !== integrationId);
    } catch (err) {
      console.error('Failed to delete integration config:', err);
      error.value = 'Failed to delete integration config';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Get a single integration by ID
  const getIntegrationConfig = async (integrationId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      return await $fetch<IntegrationConfig>(`/api/integrations/${integrationId}`);
    } catch (err) {
      console.error(`Failed to get integration ${integrationId}:`, err);
      error.value = `Failed to get integration ${integrationId}`;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    integrationConfigs,
    isLoading,
    error,
    fetchIntegrationConfigs,
    createIntegrationConfig,
    updateIntegrationConfig,
    deleteIntegrationConfig,
    getIntegrationConfig,
  };
};
