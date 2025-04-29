import { createFormDomainSchema, type FormDomain } from '~~/shared/schemas/form';

export function useFormDomains(formId: string) {
  const domains = useState<FormDomain[]>(`form-domains-${formId}`, () => []);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch domains for a form
  const fetchDomains = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $fetch<FormDomain[]>(`/api/forms/${formId}/domains`);
      domains.value = data;
      return data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch domains';
      console.error('Error fetching domains:', err);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // Add a new domain
  const addDomain = async (domain: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      createFormDomainSchema.parse({ domain });

      const data = await $fetch<FormDomain>(`/api/forms/${formId}/domains`, {
        method: 'POST',
        body: { domain },
      });

      // Update local state
      domains.value = [...domains.value, data];
      return data;
    } catch (err: any) {
      if (err.errors) {
        // Handle Zod validation errors
        error.value = err.errors[0]?.message || 'Invalid domain';
      } else {
        error.value = err.message || 'Failed to add domain';
      }
      console.error('Error adding domain:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete a domain
  const deleteDomain = async (domainId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/forms/${formId}/domains/${domainId}`, {
        method: 'DELETE',
      });

      // Update local state
      domains.value = domains.value.filter((d) => d.id !== domainId);
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to delete domain';
      console.error('Error deleting domain:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    domains,
    isLoading,
    error,
    fetchDomains,
    addDomain,
    deleteDomain,
  };
}
