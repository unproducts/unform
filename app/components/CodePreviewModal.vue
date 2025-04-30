<template>
  <Modal v-model="showModal" title="Integration Code" custom-class="w-full">
    <div class="bg-bermuda-50 p-4 rounded-md">
      <pre class="text-sm text-bermuda-700 overflow-x-auto"><code>&lt;form action="{{ formEndpoint }}" method="POST"&gt;
  &lt;!-- Your form fields here --&gt;
  &lt;button type="submit"&gt;Submit&lt;/button&gt;
&lt;/form&gt;</code></pre>
    </div>

    <div class="mt-4">
      <h3 class="text-base font-semibold text-bermuda-700 mb-2">HTML Example</h3>
      <div class="bg-bermuda-50 p-4 rounded-md">
        <pre
          class="text-sm text-bermuda-700 overflow-x-auto"
        ><code>&lt;form action="{{ formEndpoint }}" method="POST"&gt;
  &lt;div&gt;
    &lt;label for="name"&gt;Name&lt;/label&gt;
    &lt;input type="text" id="name" name="name" required&gt;
  &lt;/div&gt;
  
  &lt;div&gt;
    &lt;label for="email"&gt;Email&lt;/label&gt;
    &lt;input type="email" id="email" name="email" required&gt;
  &lt;/div&gt;
  
  &lt;div&gt;
    &lt;label for="message"&gt;Message&lt;/label&gt;
    &lt;textarea id="message" name="message" rows="4" required&gt;&lt;/textarea&gt;
  &lt;/div&gt;
  
  &lt;button type="submit"&gt;Submit&lt;/button&gt;
&lt;/form&gt;</code></pre>
      </div>
    </div>

    <div class="flex justify-end mt-6">
      <button @click="showModal = false" class="btn-secondary">Close</button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import type { Form } from '~~/shared/schemas/form';
const props = defineProps<{
  form: Form;
}>();
const showModal = defineModel<boolean>('modelValue', { required: true });

const publicRuntimeConfig = useRuntimeConfig().public;
const formEndpoint = computed(() => `${publicRuntimeConfig.host}/forms/${props.form.id}`);
</script>
