<script setup lang="ts">
import { getIntegration, IntegrationApps, WhitelistedIntegrations } from '~~/shared/consts/integrations';
import type { createIntegrationConfigSchema, IntegrationConfig } from '~~/shared/schemas/integration';

import Webhook from './Webhook.vue';
import Email from './Email.vue';
import Telegram from './Telegram.vue';
import Whatsapp from './Whatsapp.vue';
import GoogleSheets from './GoogleSheets.vue';
import Discord from './Discord.vue';

const props = defineProps<{
  integrationConfig?: IntegrationConfig;
  showConfigForm?: boolean;
  configPending?: boolean;
}>();
const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'cancel'): void;
  (e: 'delete'): void;
}>();

const configPending = defineModel<boolean>('configPending', { required: false });

const { createIntegrationConfig, updateIntegrationConfig, deleteIntegrationConfig, isLoading, error } =
  useIntegrationConfigs();

const isUpdating = computed(() => !!props.integrationConfig);
const integrationFormRef = ref<Zod.infer<typeof createIntegrationConfigSchema>>(
  props.integrationConfig || {
    name: '',
    type: 1,
    data: {},
    includeFormData: false,
  }
);

watch(
  () => props.integrationConfig,
  (value) => {
    if (!value) {
      configPending.value = false;
    } else {
      const integrationType = getIntegration(value.type)!;
      configPending.value = !integrationType.formValidationSchema.safeParse(value.data).success;
    }
  },
  { immediate: true }
);

watch(
  () => props.integrationConfig,
  (value) => {
    if (!value) {
      integrationFormRef.value = {
        name: '',
        type: 0,
        data: {},
        includeFormData: false,
      };
    } else {
      integrationFormRef.value = value;
    }
  }
);

const handleSave = async () => {
  if (isUpdating.value) {
    await updateIntegrationConfig(props.integrationConfig!.id, integrationFormRef.value);
  } else {
    await createIntegrationConfig(integrationFormRef.value);
  }
  emit('submit');
};

const handleDelete = async () => {
  await deleteIntegrationConfig(props.integrationConfig!.id);
  emit('delete');
};

const integrationFormComponent = computed(() => {
  switch (integrationFormRef.value.type) {
    case IntegrationApps.Webhook:
      return Webhook;
    case IntegrationApps.Email:
      return Email;
    case IntegrationApps.Telegram:
      return Telegram;
    case IntegrationApps.Whatsapp:
      return Whatsapp;
    case IntegrationApps.GoogleSheets:
      return GoogleSheets;
    case IntegrationApps.Discord:
      return Discord;
    default:
      return null;
  }
});
</script>

<template>
  <div class="space-y-4">
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <div v-if="!showConfigForm">
      <label for="integration-name" class="block text-sm font-medium text-gray-700 mb-1"> Integration Name </label>
      <input
        id="integration-name"
        v-model="integrationFormRef.name"
        type="text"
        class="form-input"
        placeholder="Enter a name for this integration"
      />
    </div>

    <div v-if="!isUpdating">
      <label for="integration-type" class="block text-sm font-medium text-gray-700 mb-1"> Integration Type </label>
      <select
        id="integration-type"
        v-model="integrationFormRef.type"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
      >
        <option disabled :value="null">Select an integration type</option>
        <option v-for="integration in WhitelistedIntegrations" :key="integration.type" :value="integration.type">
          {{ integration.name }}
        </option>
      </select>
    </div>

    <div class="mt-4">
      <label class="flex items-center space-x-2">
        <input
          type="checkbox"
          v-model="integrationFormRef.includeFormData"
          class="form-checkbox h-4 w-4 text-bermuda-600 rounded border-gray-300"
        />
        <span class="text-sm text-gray-700">Include form data in notifications</span>
      </label>
      <p class="mt-1 text-xs text-gray-500">
        When enabled, the complete form submission data will be included in notifications
      </p>
    </div>

    <div v-if="showConfigForm">
      <component
        :is="integrationFormComponent"
        v-if="integrationFormComponent"
        v-model:data="integrationFormRef.data"
      />
    </div>
  </div>

  <!-- Form actions -->
  <div class="flex w-full items-center justify-between mt-6" :class="{ '!justify-end': !isUpdating }">
    <button @click="handleDelete" class="btn-danger" :disabled="isLoading" v-if="isUpdating">Delete</button>
    <div class="flex justify-end space-x-3">
      <button @click="emit('cancel')" class="btn-secondary">Cancel</button>
      <button
        @click="handleSave"
        class="btn-primary"
        :disabled="!integrationFormRef.name || integrationFormRef.type === undefined || isLoading"
      >
        {{ isLoading ? 'Saving...' : 'Save' }}
      </button>
    </div>
  </div>
</template>
