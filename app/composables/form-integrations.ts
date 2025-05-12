import { ref } from 'vue';
import type { FormIntegration } from '~~/shared/schemas/form';
import { createFormIntegrationSchema } from '~~/shared/schemas/form';

export const useFormIntegrations = (formId: string) => {
  const integrations = ref<FormIntegration[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all integrations for a form
  const fetchIntegrations = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch<FormIntegration[]>(`/api/forms/${formId}/integrations`);
      integrations.value = response;
    } catch (err) {
      console.error('Failed to fetch form integrations:', err);
      error.value = 'Failed to fetch form integrations';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Add an integration to a form
  const addIntegration = async (integrationId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Validate the integration data
      createFormIntegrationSchema.parse({ integrationId });

      // Submit to API
      const createdIntegration = await $fetch<FormIntegration>(`/api/forms/${formId}/integrations`, {
        method: 'POST',
        body: { integrationId },
      });

      // Add to local list
      integrations.value.push(createdIntegration);

      return createdIntegration;
    } catch (err) {
      console.error('Failed to add integration:', err);
      error.value = 'Failed to add integration';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Remove an integration from a form
  const removeIntegration = async (formIntegration: FormIntegration) => {
    isLoading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/forms/${formId}/integrations/${formIntegration.id}`, {
        method: 'DELETE',
      });

      // Remove from local list
      integrations.value = integrations.value.filter((i) => i.id !== formIntegration.id);
    } catch (err) {
      console.error('Failed to remove integration:', err);
      error.value = 'Failed to remove integration';
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
    addIntegration,
    removeIntegration,
  };
};
