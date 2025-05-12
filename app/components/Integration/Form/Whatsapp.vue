<script setup lang="ts">
// Define the data prop with two-way binding
const data = defineModel<Record<string, any>>('data', {
  required: true,
  default: () => ({}),
});

// Initialize default values if not present
if (!data.value?.apiKey) {
  data.value = {
    ...data.value,
    apiKey: '',
    phoneNumberId: '',
    recipientNumber: '',
    messageTemplate: 'New form submission received from {formName}',
    includeFormData: true,
  };
}
</script>

<template>
  <div class="space-y-4">
    <!-- API Key -->
    <div>
      <label for="api-key" class="block text-sm font-medium text-gray-700 mb-1"> API Key </label>
      <input
        id="api-key"
        v-model="data.apiKey"
        type="password"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        placeholder="Your WhatsApp Business API key"
      />
      <p class="mt-1 text-xs text-gray-500">API key from your WhatsApp Business account</p>
    </div>

    <!-- Phone Number ID -->
    <div>
      <label for="phone-number-id" class="block text-sm font-medium text-gray-700 mb-1"> Phone Number ID </label>
      <input
        id="phone-number-id"
        v-model="data.phoneNumberId"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        placeholder="1234567890"
      />
      <p class="mt-1 text-xs text-gray-500">ID of the phone number sending messages</p>
    </div>

    <!-- Recipient Number -->
    <div>
      <label for="recipient-number" class="block text-sm font-medium text-gray-700 mb-1"> Recipient Number </label>
      <input
        id="recipient-number"
        v-model="data.recipientNumber"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        placeholder="+1234567890"
      />
      <p class="mt-1 text-xs text-gray-500">WhatsApp number to receive notifications (with country code)</p>
    </div>

    <!-- Message Template -->
    <div>
      <label for="message-template" class="block text-sm font-medium text-gray-700 mb-1"> Message Template </label>
      <textarea
        id="message-template"
        v-model="data.messageTemplate"
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        placeholder="New form submission received from {formName}"
      ></textarea>
      <p class="mt-1 text-xs text-gray-500">Template for notification messages. Use {formName} as a placeholder.</p>
    </div>

    <!-- Include form data option -->
    <div class="flex items-center space-x-2">
      <input
        id="include-form-data"
        v-model="data.includeFormData"
        type="checkbox"
        class="rounded border-gray-300 text-blue-600"
      />
      <label for="include-form-data" class="text-sm font-medium text-gray-700"> Include form data in message </label>
    </div>

    <!-- Note about WhatsApp API -->
    <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
      <p class="text-xs text-yellow-700">
        <strong>Note:</strong> WhatsApp Business API has specific requirements for message templates and approval.
        Message templates with variables need to be pre-approved in your WhatsApp Business account.
      </p>
    </div>
  </div>
</template>
