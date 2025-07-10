<script setup lang="ts">
import { FormValidationSchemas } from '~~/shared/consts/integrations';
import { z } from 'zod';
import { EmailProviderTypes } from '~~/shared/consts/integrations';

const data = defineModel<z.infer<typeof FormValidationSchemas.Email>>('data', {
  required: true,
  default: () => ({
    provider: undefined,
    providerKey: '',
    senderEmail: '',
    senderName: '',
    recipients: [''],
    cc: [],
    bcc: [],
    emailSubject: '',
    replyTo: '',
  }),
});

const isValid = defineModel<boolean>('valid', {
  required: false,
  default: false,
});

const validationSchema = FormValidationSchemas.Email;
const errors = ref<Record<string, string>>({});

const validateField = async (field: string) => {
  try {
    // For optional fields, if they're empty, don't validate
    if (['cc', 'bcc', 'replyTo'].includes(field)) {
      const value = (data.value as any)[field];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        errors.value[field] = '';
        return;
      }
    }
    await validationSchema.parseAsync({
      ...data.value,
      [field]: (data.value as any)[field],
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
      <label for="email-provider" class="block text-sm font-medium text-gray-700 mb-1">
        Email Provider <span class="text-red-500">*</span>
      </label>
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
      <label for="provider-key" class="block text-sm font-medium text-gray-700 mb-1">
        Provider API Key <span class="text-red-500">*</span>
      </label>
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

    <!-- Sender Email -->
    <div>
      <label for="sender-email" class="block text-sm font-medium text-gray-700 mb-1">
        Sender Email <span class="text-red-500">*</span>
      </label>
      <input
        id="sender-email"
        v-model="data.senderEmail"
        type="email"
        class="form-input"
        placeholder="sender@example.com"
        @blur="validateField('senderEmail')"
      />
      <p v-if="errors.senderEmail" class="mt-1 text-xs text-red-600">{{ errors.senderEmail }}</p>
    </div>

    <!-- Sender Name -->
    <div>
      <label for="sender-name" class="block text-sm font-medium text-gray-700 mb-1">
        Sender Name <span class="text-red-500">*</span>
      </label>
      <input
        id="sender-name"
        v-model="data.senderName"
        type="text"
        class="form-input"
        placeholder="Your Name or Organization"
        @blur="validateField('senderName')"
      />
      <p v-if="errors.senderName" class="mt-1 text-xs text-red-600">{{ errors.senderName }}</p>
    </div>

    <!-- Recipients -->
    <div>
      <label for="recipients" class="block text-sm font-medium text-gray-700 mb-1">
        Recipients <span class="text-red-500">*</span>
      </label>
      <div class="space-y-2">
        <div v-for="(recipient, index) in data.recipients" :key="index" class="flex gap-2">
          <input
            :id="'recipient-' + index"
            v-model="data.recipients[index]"
            type="email"
            class="form-input flex-1"
            placeholder="recipient@example.com"
            @blur="validateField('recipients')"
          />
          <button
            type="button"
            class="text-red-600 hover:text-red-800"
            @click="
              () => {
                data.recipients = data.recipients.filter((_, i) => i !== index);
                validateField('recipients');
              }
            "
            :disabled="data.recipients.length === 1"
          >
            Remove
          </button>
        </div>
        <button
          type="button"
          class="text-sm text-bermuda-600 hover:text-bermuda-800"
          @click="
            () => {
              data.recipients = [...(data.recipients || []), ''];
              validateField('recipients');
            }
          "
        >
          Add Recipient
        </button>
      </div>
      <p v-if="errors.recipients" class="mt-1 text-xs text-red-600">{{ errors.recipients }}</p>
    </div>

    <!-- CC -->
    <div>
      <label for="cc" class="block text-sm font-medium text-gray-700 mb-1">CC</label>
      <div class="space-y-2">
        <div v-for="(cc, index) in data.cc || []" :key="index" class="flex gap-2">
          <input
            :id="'cc-' + index"
            v-model="data.cc![index]"
            type="email"
            class="form-input flex-1"
            placeholder="cc@example.com"
            @blur="validateField('cc')"
          />
          <button
            type="button"
            class="text-red-600 hover:text-red-800"
            @click="() => {
              data.cc = data.cc!.filter((_, i) => i !== index);
              validateField('cc');
            }"
          >
            Remove
          </button>
        </div>
        <button
          type="button"
          class="text-sm text-bermuda-600 hover:text-bermuda-800"
          @click="
            () => {
              data.cc = [...(data.cc || []), ''];
              validateField('cc');
            }
          "
        >
          Add CC
        </button>
      </div>
      <p v-if="errors.cc" class="mt-1 text-xs text-red-600">{{ errors.cc }}</p>
    </div>

    <!-- BCC -->
    <div>
      <label for="bcc" class="block text-sm font-medium text-gray-700 mb-1">BCC</label>
      <div class="space-y-2">
        <div v-for="(bcc, index) in data.bcc || []" :key="index" class="flex gap-2">
          <input
            :id="'bcc-' + index"
            v-model="data.bcc![index]"
            type="email"
            class="form-input flex-1"
            placeholder="bcc@example.com"
            @blur="validateField('bcc')"
          />
          <button
            type="button"
            class="text-red-600 hover:text-red-800"
            @click="() => {
              data.bcc = data.bcc!.filter((_, i) => i !== index);
              validateField('bcc');
            }"
          >
            Remove
          </button>
        </div>
        <button
          type="button"
          class="text-sm text-bermuda-600 hover:text-bermuda-800"
          @click="
            () => {
              data.bcc = [...(data.bcc || []), ''];
              validateField('bcc');
            }
          "
        >
          Add BCC
        </button>
      </div>
      <p v-if="errors.bcc" class="mt-1 text-xs text-red-600">{{ errors.bcc }}</p>
    </div>

    <!-- Subject -->
    <div>
      <label for="email-subject" class="block text-sm font-medium text-gray-700 mb-1">
        Email Subject <span class="text-red-500">*</span>
      </label>
      <input
        id="email-subject"
        v-model="data.emailSubject"
        type="text"
        class="form-input"
        placeholder="New Form Submission"
        @blur="validateField('emailSubject')"
      />
      <p v-if="errors.emailSubject" class="mt-1 text-xs text-red-600">{{ errors.emailSubject }}</p>
    </div>

    <!-- Reply-To address -->
    <div>
      <label for="reply-to" class="block text-sm font-medium text-gray-700 mb-1">Reply-To Email</label>
      <input
        id="reply-to"
        v-model="data.replyTo"
        type="email"
        class="form-input"
        placeholder="reply-to@example.com"
        @blur="validateField('replyTo')"
      />
      <p v-if="errors.replyTo" class="mt-1 text-xs text-red-600">{{ errors.replyTo }}</p>
    </div>
  </div>
</template>
