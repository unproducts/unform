<script setup lang="ts">
// Define the data prop with two-way binding
const data = defineModel<Record<string, any>>('data', {
  required: true,
  default: () => ({}),
});

// Initialize default values if needed
if (!data.value?.spreadsheetId) {
  data.value = {
    ...data.value,
    spreadsheetId: '',
    sheetName: '',
    includeTimestamp: true,
    clientEmail: '',
    privateKey: '',
  };
}

const isConnected = computed(() => {
  return Boolean(
    data.value?.spreadsheetId && data.value?.sheetName && data.value?.clientEmail && data.value?.privateKey
  );
});

// Toggle authentication panel
const showAuthentication = ref(!isConnected.value);
const toggleAuthentication = () => {
  showAuthentication.value = !showAuthentication.value;
};
</script>

<template>
  <div class="space-y-4">
    <!-- Spreadsheet ID -->
    <div>
      <label for="spreadsheet-id" class="block text-sm font-medium text-gray-700 mb-1"> Spreadsheet ID </label>
      <input
        id="spreadsheet-id"
        v-model="data.spreadsheetId"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        placeholder="Paste your Google Spreadsheet ID here"
      />
      <p class="mt-1 text-xs text-gray-500">
        The ID from your spreadsheet URL: docs.google.com/spreadsheets/d/<span class="font-medium">SPREADSHEET_ID</span
        >/edit
      </p>
    </div>

    <!-- Sheet Name -->
    <div>
      <label for="sheet-name" class="block text-sm font-medium text-gray-700 mb-1"> Sheet Name </label>
      <input
        id="sheet-name"
        v-model="data.sheetName"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        placeholder="e.g. Sheet1"
      />
      <p class="mt-1 text-xs text-gray-500">Name of the specific sheet within your spreadsheet</p>
    </div>

    <!-- Include timestamp option -->
    <div class="flex items-center space-x-2">
      <input
        id="include-timestamp"
        v-model="data.includeTimestamp"
        type="checkbox"
        class="rounded border-gray-300 text-blue-600"
      />
      <label for="include-timestamp" class="text-sm font-medium text-gray-700"> Include submission timestamp </label>
    </div>

    <!-- Authentication section -->
    <div class="mt-6 border border-gray-200 rounded-lg p-4">
      <div class="flex justify-between items-center cursor-pointer" @click="toggleAuthentication">
        <h4 class="font-medium">Service Account Authentication</h4>
        <Icon :name="showAuthentication ? 'heroicons:chevron-down' : 'heroicons:chevron-right'" />
      </div>

      <div v-if="showAuthentication" class="mt-4 space-y-4">
        <div>
          <label for="client-email" class="block text-sm font-medium text-gray-700 mb-1"> Service Account Email </label>
          <input
            id="client-email"
            v-model="data.clientEmail"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="service-account@project-id.iam.gserviceaccount.com"
          />
        </div>

        <div>
          <label for="private-key" class="block text-sm font-medium text-gray-700 mb-1"> Private Key </label>
          <textarea
            id="private-key"
            v-model="data.privateKey"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
          ></textarea>
          <p class="mt-1 text-xs text-gray-500">Paste the private key from your Google service account JSON file</p>
        </div>
      </div>

      <div v-else-if="isConnected" class="mt-2">
        <p class="text-sm text-green-600">
          <Icon name="heroicons:check-circle" class="inline mr-1" />
          Authentication configured
        </p>
      </div>
    </div>
  </div>
</template>
