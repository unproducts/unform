<template>
  <Card title="Allowed Domains">
    <div class="space-y-4">
      <div v-if="error" class="bg-red-50 p-3 rounded text-red-600 text-sm">
        {{ error }}
      </div>
      <div class="flex items-center space-x-2" v-for="domain in domains" :key="domain.id">
        <input :value="domain.domain" type="text" class="form-input flex-grow" disabled />
        <button
          @click="showDeleteConfirm(domain)"
          class="btn-danger flex items-center justify-center"
          title="Remove domain"
          :disabled="disabled"
        >
          <Icon name="mdi:trash-can" class="w-5 h-5" />
        </button>
      </div>
      <div class="flex items-center gap-2">
        <input
          v-model="addDomainInput.domain"
          type="text"
          class="form-input flex-grow"
          placeholder="Enter domain (eg. unproducts.dev)"
          @input="validate"
          @keydown.enter="handleAddDomain"
        />
        <button
          @click="handleAddDomain"
          class="btn-secondary flex items-center justify-center"
          title="Add domain"
          :disabled="disabled || formInputEmpty"
        >
          <Icon name="mdi:plus" class="w-5 h-5" />
        </button>
      </div>
      <span class="text-sm text-red-600" v-if="validationErrors.domain">
        {{ validationErrors.domain }}
      </span>
    </div>
  </Card>

  <ConfirmationModal
    v-model="showDeleteModal"
    title="Remove Domain"
    :message="deleteConfirmMessage"
    confirm-text="Yes, Remove Domain"
    loading-text="Removing..."
    :loading="isLoading"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import { createFormDomainSchema, type Form, type FormDomain } from '~~/shared/schemas/form';

const props = defineProps<{
  form: Form;
}>();

const { domains, isLoading, error, deleteDomain, addDomain, fetchDomains } = useFormDomains(props.form.id);
fetchDomains();

const validationErrors = ref<Record<string, string>>({});
const showDeleteModal = ref(false);
const domainToDelete = ref<FormDomain | null>(null);

const addDomainInput = reactive<Zod.infer<typeof createFormDomainSchema>>({
  domain: '',
});

const hasErrors = computed(() => Object.keys(validationErrors.value).length > 0 || !!error.value);
const disabled = computed(() => isLoading.value || hasErrors.value);
const formInputEmpty = computed(() => addDomainInput.domain === '');

const deleteConfirmMessage = computed(() => {
  if (!domainToDelete.value) return '';
  return `Are you sure you want to remove the domain "${domainToDelete.value.domain}"? This will prevent form submissions from this domain.`;
});

const showDeleteConfirm = (domain: FormDomain) => {
  if (disabled.value) return;
  domainToDelete.value = domain;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!domainToDelete.value) return;
  await deleteDomain(domainToDelete.value.id);
  showDeleteModal.value = false;
  domainToDelete.value = null;
};

const handleAddDomain = () => {
  if (disabled.value) return;
  addDomain(addDomainInput.domain);
  addDomainInput.domain = '';
};

const validate = () => {
  try {
    validationErrors.value = {};
    createFormDomainSchema.parse(addDomainInput);
  } catch (err: any) {
    if (err.errors && err.errors.length > 0) {
      validationErrors.value.domain = err.errors[0].message;
    }
  }
};
</script>
