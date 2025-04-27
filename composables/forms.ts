import { createFormSchema, updateFormSchema, type Form } from '~/shared/schemas/form';

/**
 * Composable for managing forms data and operations
 */
export function useForms(websiteId: string) {
  const forms = useState<Form[]>(`forms-${websiteId}`, () => []);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all forms for a specific website
  const fetchForms = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $fetch<Form[]>(`/api/websites/${websiteId}/forms`);
      forms.value = data;
      return data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch forms';
      console.error('Error fetching forms:', err);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // Get a single form by ID
  const getForm = async (formId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $fetch<Form>(`/api/websites/${websiteId}/forms/${formId}`);
      return data;
    } catch (err: any) {
      error.value = err.message || `Failed to fetch form with ID ${formId}`;
      console.error(`Error fetching form ${formId}:`, err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Create a new form
  const createForm = async (formData: { name: string }) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Validate data with Zod schema
      createFormSchema.parse(formData);

      const data = await $fetch<Form>(`/api/websites/${websiteId}/forms`, {
        method: 'POST',
        body: formData,
      });

      // Update local state
      forms.value = [...forms.value, data];
      return data;
    } catch (err: any) {
      if (err.errors) {
        // Handle Zod validation errors
        error.value = err.errors[0]?.message || 'Invalid form data';
      } else {
        error.value = err.message || 'Failed to create form';
      }
      console.error('Error creating form:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Update an existing form
  const updateForm = async (formId: string, formData: Partial<{ name: string }>) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Validate data with Zod schema
      updateFormSchema.parse(formData);

      const data = await $fetch<Form>(`/api/websites/${websiteId}/forms/${formId}`, {
        method: 'PUT',
        body: formData,
      });

      // Update local state
      forms.value = forms.value.map((form) => (form.id === formId ? data : form));

      return data;
    } catch (err: any) {
      if (err.errors) {
        // Handle Zod validation errors
        error.value = err.errors[0]?.message || 'Invalid form data';
      } else {
        error.value = err.message || `Failed to update form with ID ${formId}`;
      }
      console.error(`Error updating form ${formId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete a form
  const deleteForm = async (formId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/websites/${websiteId}/forms/${formId}`, {
        method: 'DELETE',
      });

      // Update local state
      forms.value = forms.value.filter((form) => form.id !== formId);
      return true;
    } catch (err: any) {
      error.value = err.message || `Failed to delete form with ID ${formId}`;
      console.error(`Error deleting form ${formId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    forms,
    isLoading,
    error,
    fetchForms,
    getForm,
    createForm,
    updateForm,
    deleteForm,
  };
}
