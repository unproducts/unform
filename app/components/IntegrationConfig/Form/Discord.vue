<script setup lang="ts">
import { FormValidationSchemas } from '~~/shared/consts/integrations';
import { z } from 'zod';

const data = defineModel<z.infer<typeof FormValidationSchemas.Discord>>('data', {
  required: true,
  default: () => ({
    webhookUrl: '',
    botUsername: '',
    avatarUrl: '',
    embedColor: '#5865F2', // Discord blue
    includeFormName: true,
  }),
});
const isValid = defineModel<boolean>('valid', {
  required: true,
  default: false,
});

const validationSchema = FormValidationSchemas.Discord;
const errors = ref<Record<string, string>>({});

const validateField = async (field: string) => {
  try {
    await validationSchema.parseAsync({
      ...data.value,
      [field]: data.value[field],
    });
    errors.value[field] = '';
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.errors.find((err) => err.path[0] === field);
      if (fieldError) {
        errors.value[field] = fieldError.message;
      }
    }
  }
};

const validateAllFields = async () => {
  try {
    await validationSchema.parseAsync(data.value);
    errors.value = {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.value = error.errors.reduce((acc, err) => {
        acc[err.path[0] as string] = err.message;
        return acc;
      }, {} as Record<string, string>);
    }
  }
};

validateAllFields();

watch(
  errors,
  (newErrors) => {
    isValid.value = Object.values(newErrors).every((error) => error === '');
  },
  { immediate: true }
);
</script>

<template>
  <div class="space-y-4">
    <!-- Discord Webhook URL -->
    <div>
      <label for="webhook-url" class="block text-sm font-medium text-gray-700 mb-1">Discord Webhook URL</label>
      <input
        id="webhook-url"
        v-model="data.webhookUrl"
        type="url"
        class="form-input"
        :class="{ 'border-red-500': errors.webhookUrl }"
        placeholder="https://discord.com/api/webhooks/..."
        @blur="validateField('webhookUrl')"
      />
      <p v-if="errors.webhookUrl" class="mt-1 text-xs text-red-600">{{ errors.webhookUrl }}</p>
      <p v-else class="mt-1 text-xs text-gray-500">Create a webhook in your Discord server settings</p>
    </div>

    <!-- Bot Username -->
    <div>
      <label for="bot-username" class="block text-sm font-medium text-gray-700 mb-1">Bot Username (Optional)</label>
      <input
        id="bot-username"
        v-model="data.botUsername"
        type="text"
        class="form-input"
        :class="{ 'border-red-500': errors.botUsername }"
        placeholder="Form Notification Bot"
        @blur="validateField('botUsername')"
      />
      <p v-if="errors.botUsername" class="mt-1 text-xs text-red-600">{{ errors.botUsername }}</p>
      <p v-else class="mt-1 text-xs text-gray-500">Custom username for the webhook messages</p>
    </div>

    <!-- Avatar URL -->
    <div>
      <label for="avatar-url" class="block text-sm font-medium text-gray-700 mb-1">Avatar URL (Optional)</label>
      <input
        id="avatar-url"
        v-model="data.avatarUrl"
        type="url"
        class="form-input"
        :class="{ 'border-red-500': errors.avatarUrl }"
        placeholder="https://example.com/avatar.png"
        @blur="validateField('avatarUrl')"
      />
      <p v-if="errors.avatarUrl" class="mt-1 text-xs text-red-600">{{ errors.avatarUrl }}</p>
      <p v-else class="mt-1 text-xs text-gray-500">Custom avatar image URL for the webhook messages</p>
    </div>

    <!-- Embed Color -->
    <div>
      <label for="embed-color" class="block text-sm font-medium text-gray-700 mb-1">Embed Color</label>
      <div class="flex items-center gap-2">
        <input
          id="embed-color-picker"
          v-model="data.embedColor"
          type="color"
          class="h-8 w-14 border border-gray-300 rounded focus:ring-bermuda-500 focus:border-bermuda-500"
          @blur="validateField('embedColor')"
        />
        <input
          id="embed-color-text"
          v-model="data.embedColor"
          type="text"
          class="form-input"
          :class="{ 'border-red-500': errors.embedColor }"
          placeholder="#5865F2"
          @blur="validateField('embedColor')"
        />
      </div>
      <p v-if="errors.embedColor" class="mt-1 text-xs text-red-600">{{ errors.embedColor }}</p>
      <p v-else class="mt-1 text-xs text-gray-500">Color for the Discord message embed</p>
    </div>

    <!-- Include form name option -->
    <div class="flex items-center space-x-2">
      <input
        id="include-form-name"
        v-model="data.includeFormName"
        type="checkbox"
        class="rounded border-gray-300 text-bermuda-600 focus:ring-bermuda-500"
      />
      <label for="include-form-name" class="text-sm font-medium text-bermuda-700">
        Include form name in notifications
      </label>
    </div>
  </div>
</template>
