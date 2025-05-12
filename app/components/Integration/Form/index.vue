<script setup lang="ts">
import { getIntegrationType, IntegrationTypeEnum, IntegrationTypes } from '~~/shared/consts/integrations';
import type { createIntegrationSchema, Integration } from '~~/shared/schemas/integration';

import Webhook from './Webhook.vue';
import Email from './Email.vue';
import Telegram from './Telegram.vue';
import Whatsapp from './Whatsapp.vue';
import GoogleSheets from './GoogleSheets.vue';
import Discord from './Discord.vue';

const props = defineProps<{
  integration?: Integration;
  showConfigForm?: boolean;
  configPending?: boolean;
}>();
const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'cancel'): void;
  (e: 'delete'): void;
}>();

const configPending = defineModel<boolean>('configPending', { required: false });

const { createIntegration, updateIntegration, deleteIntegration, isLoading, error } = useIntegrations();

const isUpdating = computed(() => !!props.integration);
const integrationFormRef = ref<Zod.infer<typeof createIntegrationSchema>>(
  props.integration || {
    name: '',
    type: 0,
    data: {},
  }
);

watch(
  () => props.integration,
  (value) => {
    if (!value) {
      configPending.value = false;
    } else {
      const integrationType = getIntegrationType(value.type)!;
      console.log(integrationType, value);
      configPending.value = !integrationType.formValidationSchema.safeParse(value.data).success;
    }
  },
  { immediate: true }
);

watch(
  () => props.integration,
  (value) => {
    if (!value) {
      integrationFormRef.value = {
        name: '',
        type: 0,
        data: {},
      };
    } else {
      integrationFormRef.value = value;
    }
  }
);

const handleSave = async () => {
  if (isUpdating.value) {
    await updateIntegration(props.integration!.id, integrationFormRef.value);
  } else {
    await createIntegration(integrationFormRef.value);
  }
  emit('submit');
};

const handleDelete = async () => {
  await deleteIntegration(props.integration!.id);
  emit('delete');
};

const integrationFormComponent = computed(() => {
  switch (integrationFormRef.value.type) {
    case IntegrationTypeEnum.Webhook:
      return Webhook;
    case IntegrationTypeEnum.Email:
      return Email;
    case IntegrationTypeEnum.Telegram:
      return Telegram;
    case IntegrationTypeEnum.Whatsapp:
      return Whatsapp;
    case IntegrationTypeEnum.GoogleSheets:
      return GoogleSheets;
    case IntegrationTypeEnum.Discord:
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
        <option v-for="integrationType in IntegrationTypes" :key="integrationType.type" :value="integrationType.type">
          {{ integrationType.name }}
        </option>
      </select>
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
