<script setup lang="ts">
import { FormValidationSchemas } from '~~/shared/consts/integrations';
import { z } from 'zod';

const data = defineModel<z.infer<typeof FormValidationSchemas.Webhook>>('data', {
  required: true,
  default: () => ({
    url: '',
    headers: {},
  }),
});

const isValid = defineModel<boolean>('valid', {
  required: true,
  default: false,
});

const validationSchema = FormValidationSchemas.Webhook;
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

// Header management
const headerKey = ref('');
const headerValue = ref('');

const addHeader = () => {
  if (headerKey.value && headerValue.value) {
    data.value.headers = {
      ...data.value.headers,
      [headerKey.value]: headerValue.value,
    };
    headerKey.value = '';
    headerValue.value = '';
    validateField('headers');
  }
};

const removeHeader = (key: string) => {
  const { [key]: _, ...rest } = data.value.headers;
  data.value.headers = rest;
  validateField('headers');
};
</script>

<template>
  <div class="space-y-4">
    <!-- Webhook URL -->
    <div>
      <label for="webhook-url" class="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
      <input
        id="webhook-url"
        v-model="data.url"
        type="url"
        class="form-input"
        :class="{ 'border-red-500': errors.url }"
        placeholder="https://example.com/webhook"
        @blur="validateField('url')"
      />
      <p v-if="errors.url" class="mt-1 text-xs text-red-600">{{ errors.url }}</p>
      <p v-else class="mt-1 text-xs text-gray-500">URL where form submissions will be sent</p>
    </div>

    <!-- Headers -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Custom Headers (Optional)</label>
      <div class="space-y-2">
        <!-- Header List -->
        <div v-if="Object.keys(data.headers || {}).length > 0" class="space-y-2">
          <div
            v-for="(value, key) in data.headers"
            :key="key"
            class="flex items-center justify-between p-2 bg-gray-50 rounded-md"
          >
            <div class="text-sm">
              <span class="font-medium">{{ key }}:</span>
              <span class="text-gray-600 ml-1">{{ value }}</span>
            </div>
            <button type="button" class="text-xs text-red-600 hover:text-red-800" @click="removeHeader(key.toString())">
              Remove
            </button>
          </div>
        </div>

        <!-- Add Header Form -->
        <div class="flex gap-2">
          <input v-model="headerKey" type="text" class="form-input flex-1" placeholder="Header name" />
          <input v-model="headerValue" type="text" class="form-input flex-1" placeholder="Header value" />
          <button type="button" class="btn-secondary" :disabled="!headerKey || !headerValue" @click="addHeader">
            Add
          </button>
        </div>
      </div>
      <p v-if="errors.headers" class="mt-1 text-xs text-red-600">{{ errors.headers }}</p>
      <p v-else class="mt-1 text-xs text-gray-500">Add custom headers to be sent with the webhook request</p>
    </div>
  </div>
</template>
