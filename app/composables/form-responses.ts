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
    if (!responses.value.length) {
      return '';
    }

    // Get all unique fields from all responses
    const fields = new Set<string>();
    fields.add('ID');
    fields.add('Date');

    responses.value.forEach((response) => {
      if (response.data && typeof response.data === 'object') {
        Object.keys(response.data).forEach((key) => fields.add(key));
      }
    });

    // Convert fields to array
    const headers = Array.from(fields);

    // Create CSV content
    const csvContent = [
      // Headers row
      headers.join(','),
      // Data rows
      ...responses.value.map((response) => {
        return headers
          .map((header) => {
            let value = '';
            if (header === 'ID') {
              value = response.id;
            } else if (header === 'Date') {
              value = new Date(response.createdAt).toLocaleString();
            } else if (response.data && typeof response.data === 'object') {
              value = response.data[header] || '';
            }
            // Escape quotes and wrap in quotes if contains comma or newline
            value = String(value).replace(/"/g, '""');
            if (value.includes(',') || value.includes('\n') || value.includes('"')) {
              value = `"${value}"`;
            }
            return value;
          })
          .join(',');
      }),
    ].join('\n');

    return csvContent;
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
