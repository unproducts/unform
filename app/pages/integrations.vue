<script setup lang="ts">
import type { IntegrationConfig } from '~~/shared/schemas/integration';
import { getIntegration } from '~~/shared/consts/integrations';
import { FormValidationSchemas } from '~~/shared/consts/integrations';

const { integrationConfigs, isLoading, fetchIntegrationConfigs } = useIntegrationConfigs();

fetchIntegrationConfigs();

const createNewIntegration = () => {
  showForm.value = true;
};

const showForm = ref(false);

const activeIntegration = ref<IntegrationConfig | null>(null);

// Add validation function
const validateIntegration = (integrationConfig: IntegrationConfig) => {
  const schema =
    FormValidationSchemas[getIntegration(integrationConfig.type)?.id as keyof typeof FormValidationSchemas];
  if (!schema) return true; // If no schema found, assume valid
  try {
    schema.parse(integrationConfig.data);
    return true;
  } catch (error) {
    return false;
  }
};
</script>

<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/forms" class="text-bermuda-600 hover:text-bermuda-800 flex items-center">
        <Icon name="si:arrow-left-line" class="w-6 h-6 mr-1" />
        Back to Forms
      </NuxtLink>
    </div>

    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-bermuda-800">Integrations</h1>
      <button @click="createNewIntegration" class="btn-primary">
        <Icon name="material-symbols:add" class="mr-1" />
        New Integration
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="spinner"></div>
    </div>

    <!-- Empty state -->
    <EmptyState
      v-else-if="!integrationConfigs?.length"
      message="No Integrations Found"
      icon="material-symbols:integration-instructions"
      actionLabel="Create Integration"
      :actionClick="createNewIntegration"
    />

    <!-- Integration list -->
    <div v-else class="space-y-4">
      <div class="w-full" v-for="integrationConfig in integrationConfigs" :key="integrationConfig.id">
        <button
          class="flex items-center justify-between p-4 cursor-pointer w-full bg-white hover:bg-gray-50 rounded-md border border-gray-200"
          @click="
            () => {
              if (activeIntegration?.id === integrationConfig.id) {
                activeIntegration = null;
              } else {
                activeIntegration = integrationConfig;
              }
            }
          "
        >
          <div class="flex items-center">
            <div class="w-10 h-10 flex items-center justify-center rounded-full bg-bermuda-100 mr-3">
              <Icon
                :name="getIntegration(integrationConfig.type)?.icon || 'material-symbols:integration-instructions'"
                size="20"
                class="text-bermuda-500"
              />
            </div>
            <div class="text-left">
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-medium">{{ integrationConfig.name }}</h3>
                <Icon
                  v-if="!validateIntegration(integrationConfig)"
                  name="material-symbols:warning"
                  size="20"
                  class="text-yellow-500"
                  title="Integration configuration is invalid"
                />
              </div>
              <p class="text-sm text-gray-600">{{ getIntegration(integrationConfig.type)?.description }}</p>
            </div>
          </div>
          <Icon
            name="heroicons:chevron-right"
            size="20"
            class="text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-90': activeIntegration?.id === integrationConfig.id }"
          />
        </button>
        <Transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform -translate-y-4 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform -translate-y-4 opacity-0"
        >
          <div v-if="activeIntegration?.id === integrationConfig.id" class="-mt-4">
            <IntegrationConfigEdit
              :integration-config="integrationConfig"
              @cancel="activeIntegration = null"
              @edited="fetchIntegrationConfigs"
            />
          </div>
        </Transition>
      </div>
    </div>

    <!-- Integration form modal -->
    <IntegrationConfigCreateModal v-model="showForm" @submit="fetchIntegrationConfigs" />
  </div>
</template>
