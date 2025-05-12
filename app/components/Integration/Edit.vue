<script setup lang="ts">
import type { Integration } from '~~/shared/schemas/integration';

defineProps<{
  integration: Integration;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
}>();
</script>

<template>
  <Card title="Edit Integration">
    <IntegrationForm
      :integration="integration"
      @cancel="emit('cancel')"
      :show-config-form="true"
      :show-delete-button="true"
    />
  </Card>
</template>
