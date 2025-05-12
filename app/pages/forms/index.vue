<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-bermuda-800">Your Forms</h1>
      <div class="flex gap-3">
        <NuxtLink to="/integrations" class="btn-secondary">Integrations</NuxtLink>
        <button @click="showAddFormModal = true" class="btn-primary" :disabled="isLoading">Add Form</button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-600 mb-6">
      {{ error }}
      <button @click="fetchForms" class="text-red-700 underline ml-2">Try again</button>
    </div>

    <EmptyState
      v-else-if="forms.length === 0"
      icon="form"
      message="You don't have any forms yet. Add your first form to get started."
      actionLabel="Add Form"
      :actionClick="() => (showAddFormModal = true)"
    />

    <div v-else class="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="form in forms"
        :key="form.id"
        :to="`/forms/${form.id}`"
        class="card hover:shadow-lg transition-shadow duration-200"
      >
        <h2 class="text-base md:text-lg font-semibold text-bermuda-700 mb-2">{{ form.name }}</h2>
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div class="text-xs md:text-sm text-bermuda-600">{{ formatDate(form.createdAt) }}</div>
          <div class="text-xs md:text-sm text-bermuda-500 flex items-center">
            <Icon name="eye" class="w-3 h-3 md:w-4 md:h-4 mr-1" />
            View Responses
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Add Form Modal Component -->
    <CreateFormModal v-model="showAddFormModal" @form-created="fetchForms" />
  </div>
</template>

<script setup lang="ts">
const { forms, isLoading, error, fetchForms } = useForms();
fetchForms();

const showAddFormModal = ref<boolean>(false);

// Format date helper
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};
</script>
