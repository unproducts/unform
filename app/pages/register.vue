<script setup lang="ts">
import { registerSchema } from '~~/shared/schemas/authentication';

const router = useRouter();
const { register } = useRegister();

const name = ref('');
const email = ref('');
const password = ref('');
const errors = ref<Record<string, string>>({});
const registerError = ref('');
const isLoading = ref(false);

async function handleRegister() {
  try {
    errors.value = {};
    registerError.value = '';

    const formData = {
      name: name.value,
      email: email.value,
      password: password.value,
    };
    registerSchema.parse(formData);
    isLoading.value = true;

    try {
      await register(formData);
      router.push('/websites');
    } catch (error: any) {
      if (error.response) {
        registerError.value = error.response._data?.message || 'Registration failed. Please try again.';
      } else {
        registerError.value = 'An unexpected error occurred. Please try again.';
        console.error('Registration error:', error);
      }
    } finally {
      isLoading.value = false;
    }
  } catch (error: any) {
    if (error.errors) {
      error.errors.forEach((err: any) => {
        if (err.path && err.path.length > 0) {
          errors.value[err.path[0]] = err.message;
        }
      });
    } else {
      registerError.value = 'An unexpected error occurred. Please try again.';
      console.error('Registration error:', error);
    }
  }
}
</script>

<template>
  <div class="flex items-center justify-center mt-8 bg-bermuda-50">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div class="text-center">
        <img src="~/assets/icon.svg" alt="Unform Logo" class="w-16 h-16 mx-auto" />
        <h1 class="text-3xl font-extrabold text-bermuda-800">Unform</h1>
        <p class="mt-2 text-sm text-bermuda-600">Create your account</p>
      </div>

      <form @submit.prevent="handleRegister" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-bermuda-700">Full Name</label>
            <input id="name" type="text" v-model="name" required class="form-input" />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-bermuda-700">Email</label>
            <input id="email" type="email" v-model="email" required class="form-input" />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-bermuda-700">Password</label>
            <input id="password" type="password" v-model="password" required class="form-input" />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>
        </div>

        <div v-if="registerError" class="text-red-600 text-sm text-center">
          {{ registerError }}
        </div>

        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-bermuda-500 hover:bg-bermuda-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bermuda-500"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Loading...</span>
            <span v-else>Create Account</span>
          </button>
        </div>

        <div class="text-center text-sm">
          <p>
            Already have an account?
            <NuxtLink to="/login" class="text-bermuda-600 hover:text-bermuda-800">Sign in</NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
