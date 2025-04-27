import { createWebsiteSchema, updateWebsiteSchema, type Website } from '~/shared/schemas/website';

/**
 * Composable for managing websites data and operations
 */
export function useWebsites() {
  const websites = useState<Website[]>('websites', () => []);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all websites for the authenticated user
  const fetchWebsites = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $fetch<Website[]>('/api/websites');
      websites.value = data;
      return data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch websites';
      console.error('Error fetching websites:', err);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // Get a single website by ID
  const getWebsite = async (id: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $fetch<Website>(`/api/websites/${id}`);
      return data;
    } catch (err: any) {
      error.value = err.message || `Failed to fetch website with ID ${id}`;
      console.error(`Error fetching website ${id}:`, err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Create a new website
  const createWebsite = async (websiteData: { name: string; domain: string }) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Validate data with Zod schema
      createWebsiteSchema.parse(websiteData);

      const data = await $fetch<Website>('/api/websites', {
        method: 'POST',
        body: websiteData,
      });

      // Update local state
      websites.value = [...websites.value, data];
      return data;
    } catch (err: any) {
      if (err.errors) {
        // Handle Zod validation errors
        error.value = err.errors[0]?.message || 'Invalid website data';
      } else {
        error.value = err.message || 'Failed to create website';
      }
      console.error('Error creating website:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Update an existing website
  const updateWebsite = async (id: string, websiteData: Partial<{ name: string; domain: string }>) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Validate data with Zod schema
      updateWebsiteSchema.parse(websiteData);

      const data = await $fetch<Website>(`/api/websites/${id}`, {
        method: 'PUT',
        body: websiteData,
      });

      // Update local state
      websites.value = websites.value.map((website) => (website.id === id ? data : website));

      return data;
    } catch (err: any) {
      if (err.errors) {
        // Handle Zod validation errors
        error.value = err.errors[0]?.message || 'Invalid website data';
      } else {
        error.value = err.message || `Failed to update website with ID ${id}`;
      }
      console.error(`Error updating website ${id}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete a website
  const deleteWebsite = async (id: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/websites/${id}`, {
        method: 'DELETE',
      });

      // Update local state
      websites.value = websites.value.filter((website) => website.id !== id);
      return true;
    } catch (err: any) {
      error.value = err.message || `Failed to delete website with ID ${id}`;
      console.error(`Error deleting website ${id}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    websites,
    isLoading,
    error,
    fetchWebsites,
    getWebsite,
    createWebsite,
    updateWebsite,
    deleteWebsite,
  };
}
