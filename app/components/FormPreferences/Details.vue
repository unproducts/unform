<script setup lang="ts">
import { updateFormSchema, type Form } from '~~/shared/schemas/form';

const props = defineProps<{
  form: Form;
}>();

const emits = defineEmits<{
  (e: 'formUpdated'): void;
}>();

const { updateForm, isLoading, error } = useForms();
const validationErrors = ref<Record<string, string>>({});

const hasErrors = computed(() => Object.keys(validationErrors.value).length > 0 || !!error.value);
const disabled = computed(() => isLoading.value || hasErrors.value);

const editFormData = ref<Zod.infer<typeof updateFormSchema>>({
  name: props.form.name,
});

watch(
  () => props.form,
  (newForm) => {
    editFormData.value.name = newForm.name;
  }
);

function validate() {
  try {
    updateFormSchema.shape.name.parse(editFormData.value.name);
    validationErrors.value = {};
  } catch (err: any) {
    if (err.errors && err.errors.length > 0) {
      validationErrors.value.name = err.errors[0].message;
    }
  }
}

function handleUpdateForm() {
  if (disabled.value) return;
  updateForm(props.form.id, editFormData.value).then(() => {
    emits('formUpdated');
  });
}
</script>

<template>
  <Card title="Details">
    <div class="space-y-4">
      <div>
        <label for="form-name" class="block text-sm font-medium text-bermuda-700">Form Name</label>
        <div class="mt-1 flex items-center gap-2">
          <input
            id="form-name"
            v-model="editFormData.name"
            type="text"
            class="form-input flex-grow"
            placeholder="Enter form name"
            @input="validate"
            @blur="validate"
          />
          <button @click="handleUpdateForm" class="btn-primary" :disabled="disabled">
            <span v-if="isLoading">Saving...</span>
            <span v-else>Save</span>
          </button>
        </div>
        <p v-if="validationErrors.name" class="mt-1 text-sm text-red-600">{{ validationErrors.name }}</p>
      </div>
    </div>
  </Card>
</template>
