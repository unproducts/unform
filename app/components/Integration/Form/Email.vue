<script setup lang="ts">
import { FormValidationSchemas } from '~~/shared/consts/integrations';
import { z } from 'zod';
import { EmailProviderTypes } from '~~/shared/consts/integrations';

const data = defineModel<z.infer<typeof FormValidationSchemas.Email>>('data', {
  required: true,
});
const isValid = defineModel<boolean>('valid', {
  required: true,
  default: false,
});

const validationSchema = FormValidationSchemas.Email;
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

const providerOptions = Object.entries(EmailProviderTypes)
  .filter(([key]) => isNaN(Number(key)))
  .map(([key, value]) => ({ label: key, value }));
</script>

<template>
  <div class="space-y-4">
    <!-- Provider -->
    <div>
      <label for="email-provider" class="block text-sm font-medium text-gray-700 mb-1">Email Provider</label>
      <select
        id="email-provider"
        v-model="data.provider"
        class="form-input"
        placeholder="Select your email provider"
        @blur="validateField('provider')"
      >
        <option :value="undefined">Select your email provider</option>
        <option v-for="option in providerOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <p v-if="errors.provider" class="mt-1 text-xs text-red-600">{{ errors.provider }}</p>
    </div>

    <!-- Provider Key -->
    <div>
      <label for="provider-key" class="block text-sm font-medium text-gray-700 mb-1">Provider API Key</label>
      <input
        id="provider-key"
        v-model="data.providerKey"
        type="password"
        class="form-input"
        placeholder="Enter your provider API key"
        @blur="validateField('providerKey')"
      />
      <p v-if="errors.providerKey" class="mt-1 text-xs text-red-600">{{ errors.providerKey }}</p>
    </div>

    <!-- Email address -->
    <div>
      <label for="email-address" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
      <input
        id="email-address"
        v-model="data.email"
        type="email"
        class="form-input"
        :class="{ 'border-red-500': errors.email }"
        placeholder="recipient@example.com"
        @blur="validateField('email')"
      />
      <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
      <p v-else class="mt-1 text-xs text-gray-500">Email where form submissions will be sent</p>
    </div>

    <!-- Subject -->
    <div>
      <label for="email-subject" class="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
      <input
        id="email-subject"
        v-model="data.emailSubject"
        type="text"
        class="form-input"
        :class="{ 'border-red-500': errors.emailSubject }"
        placeholder="New Form Submission"
        @blur="validateField('emailSubject')"
      />
      <p v-if="errors.emailSubject" class="mt-1 text-xs text-red-600">{{ errors.emailSubject }}</p>
    </div>

    <!-- Reply-To address -->
    <div>
      <label for="reply-to" class="block text-sm font-medium text-gray-700 mb-1">Reply-To Email (Optional)</label>
      <input
        id="reply-to"
        v-model="data.replyTo"
        type="email"
        class="form-input"
        :class="{ 'border-red-500': errors.replyTo }"
        placeholder="reply-to@example.com"
        @blur="validateField('replyTo')"
      />
      <p v-if="errors.replyTo" class="mt-1 text-xs text-red-600">{{ errors.replyTo }}</p>
      <p v-else class="mt-1 text-xs text-gray-500">If filled, sets the Reply-To header to this email</p>
    </div>

    <!-- Include form data -->
    <div class="flex items-center space-x-2">
      <input
        id="include-form-data"
        v-model="data.includeFormData"
        type="checkbox"
        class="rounded border-gray-300 text-bermuda-600 focus:ring-bermuda-500"
      />
      <label for="include-form-data" class="text-sm font-medium text-bermuda-700">Include form data in email</label>
    </div>
  </div>
</template>
