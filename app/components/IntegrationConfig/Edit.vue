<script setup lang="ts">
import type { IntegrationConfig } from '~~/shared/schemas/integration';

defineProps<{
  integrationConfig: IntegrationConfig;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
}>();
</script>

<template>
  <Card title="Edit Integration">
    <IntegrationConfigForm
      :integrationConfig="integrationConfig"
      @cancel="emit('cancel')"
      :show-config-form="true"
      :show-delete-button="true"
    />
  </Card>
</template>
