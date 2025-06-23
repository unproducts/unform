import { ref } from 'vue';
import type { FormIntegrationConfig } from '~~/shared/schemas/form';
import { createFormIntegrationConfigSchema } from '~~/shared/schemas/form';

export const useFormIntegrations = (formId: string) => {
  const formIntegrationConfigs = ref<FormIntegrationConfig[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all integrations for a form
  const fetchFormIntegrations = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch<FormIntegrationConfig[]>(`/api/forms/${formId}/integrations`);
      formIntegrationConfigs.value = response;
    } catch (err) {
      console.error('Failed to fetch form integrations:', err);
      error.value = 'Failed to fetch form integrations';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Add an integration to a form
  const addFormIntegration = async (integrationConfigId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Validate the integration data
      createFormIntegrationConfigSchema.parse({ integrationConfigId });

      // Submit to API
      const createFormIntegrationConfig = await $fetch<FormIntegrationConfig>(`/api/forms/${formId}/integrations`, {
        method: 'POST',
        body: { integrationConfigId },
      });

      // Add to local list
      formIntegrationConfigs.value.push(createFormIntegrationConfig);

      return createFormIntegrationConfig;
    } catch (err) {
      console.error('Failed to add integration:', err);
      error.value = 'Failed to add integration';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Remove an integration from a form
  const removeFormIntegration = async (formIntegrationConfig: FormIntegrationConfig) => {
    isLoading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/forms/${formId}/integrations/${formIntegrationConfig.id}`, {
        method: 'DELETE',
      });

      // Remove from local list
      formIntegrationConfigs.value = formIntegrationConfigs.value.filter((i) => i.id !== formIntegrationConfig.id);
    } catch (err) {
      console.error('Failed to remove integration:', err);
      error.value = 'Failed to remove integration';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    formIntegrationConfigs,
    isLoading,
    error,
    fetchFormIntegrations,
    addFormIntegration,
    removeFormIntegration,
  };
};
