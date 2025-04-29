import { type FormResponse } from '~~/shared/schemas/form';

/**
 * Composable for managing form responses
 */
export function useFormResponses(formId: string) {
  const responses = useState<FormResponse[]>(`form-responses-${formId}`, () => []);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all responses for a form
  const fetchResponses = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $fetch<FormResponse[]>(`/api/forms/${formId}/responses`);
      responses.value = data;
      return data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch form responses';
      console.error('Error fetching form responses:', err);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // Delete a response
  const deleteResponse = async (responseId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/forms/${formId}/responses/${responseId}`, {
        method: 'DELETE',
      });

      // Update local state
      responses.value = responses.value.filter((response) => response.id !== responseId);
      return true;
    } catch (err: any) {
      error.value = err.message || `Failed to delete response with ID ${responseId}`;
      console.error(`Error deleting response ${responseId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Export responses as CSV
  const exportResponsesAsCSV = () => {
    // This function could be implemented to generate a CSV from the responses
    // For now, we'll just return the JSON data
    return responses.value;
  };

  return {
    responses,
    isLoading,
    error,
    fetchResponses,
    deleteResponse,
    exportResponsesAsCSV,
  };
}
