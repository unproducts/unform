<template>
  <div>
    <div class="mb-6">
      <NuxtLink :to="`/forms/${formId}`" class="text-bermuda-600 hover:text-bermuda-800 flex items-center">
        <Icon name="si:arrow-left-line" class="w-6 h-6 mr-1" />
        <span>Back to responses</span>
      </NuxtLink>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-600 mb-6">
      {{ error }}
    </div>

    <div v-else>
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-bermuda-800 mb-1">{{ form?.name }}</h1>
        <p class="text-bermuda-600">Form Preferences</p>
      </div>

      <FormPreferencesDetails :form="form" v-if="form" @form-updated="setFormData" />
      <FormPreferencesDomains :form="form" v-if="form" />
      <FormPreferencesIntegrations :form="form" v-if="form" />
      <FormPreferencesDanger :form="form" v-if="form" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Form } from '~~/shared/schemas/form';

const route = useRoute();
const formId = route.params.formId as string;

const { getForm, isLoading, error } = useForms();

const form = ref<Form | null>(null);

setFormData();

function setFormData() {
  getForm(formId).then((formData) => {
    if (formData) {
      form.value = formData;
    }
  });
}
</script>
