<script setup lang="ts">
import { FormValidationSchemas } from '~~/shared/consts/integrations';
import { z } from 'zod';

const data = defineModel<z.infer<typeof FormValidationSchemas.Telegram>>('data', {
  required: true,
  default: () => ({
    token: '',
    chatId: '',
  }),
});

const isValid = defineModel<boolean>('valid', {
  required: true,
  default: false,
});

const validationSchema = FormValidationSchemas.Telegram;
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
    <!-- Bot Token -->
    <div>
      <label for="telegram-token" class="block text-sm font-medium text-gray-700 mb-1">Bot Token</label>
      <input
        id="telegram-token"
        v-model="data.botToken"
        type="password"
        class="form-input"
        :class="{ 'border-red-500': errors.botToken }"
        placeholder="Enter your Telegram bot token"
        @blur="validateField('botToken')"
      />
      <p v-if="errors.botToken" class="mt-1 text-xs text-red-600">{{ errors.botToken }}</p>
      <p class="mt-1 text-xs text-gray-500">
        Get your bot token from
        <a href="https://t.me/BotFather" target="_blank" class="text-bermuda-600 hover:text-bermuda-700">@BotFather</a>
      </p>
    </div>

    <!-- Chat ID -->
    <div>
      <label for="telegram-chat-id" class="block text-sm font-medium text-gray-700 mb-1">Chat ID</label>
      <input
        id="telegram-chat-id"
        v-model="data.chatId"
        type="text"
        class="form-input"
        :class="{ 'border-red-500': errors.chatId }"
        placeholder="Enter your Telegram chat ID"
        @blur="validateField('chatId')"
      />
      <p v-if="errors.chatId" class="mt-1 text-xs text-red-600">{{ errors.chatId }}</p>
      <p class="mt-1 text-xs text-gray-500">
        Chat ID where form submissions will be sent. Can be a channel ID (e.g. -1001234567890) or a user ID
      </p>
    </div>

    <!-- Testing instructions -->
    <div class="mt-4 p-3 bg-bermuda-50 border border-bermuda-200 rounded-md">
      <h4 class="text-sm font-medium text-bermuda-700 mb-1">Testing your bot</h4>
      <p class="text-xs text-bermuda-600">
        1. Start a chat with your bot<br />
        2. Add your bot to a group or channel<br />
        3. Make the bot an admin for channels
      </p>
    </div>
  </div>
</template>
