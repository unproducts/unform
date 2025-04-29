<script setup lang="ts">
import { loginSchema } from '~~/shared/schemas/authentication';

const router = useRouter();
const { login } = useLogin();

const email = ref('');
const password = ref('');
const errors = ref<Record<string, string>>({});
const loginError = ref('');
const isLoading = ref(false);

async function handleLogin() {
  try {
    errors.value = {};
    loginError.value = '';

    const formData = {
      email: email.value,
      password: password.value,
    };
    loginSchema.parse(formData);
    isLoading.value = true;
    try {
      await login(formData);
      router.push('/forms');
    } catch (error: any) {
      if (error.response) {
        loginError.value = error.response._data?.message || 'Login failed. Please try again.';
      } else {
        loginError.value = 'An unexpected error occurred. Please try again.';
        console.error('Login error:', error);
      }
    } finally {
      isLoading.value = false;
    }
  } catch (error: any) {
    // Handle Zod validation errors
    if (error.errors) {
      error.errors.forEach((err: any) => {
        if (err.path && err.path.length > 0) {
          errors.value[err.path[0]] = err.message;
        }
      });
    } else {
      loginError.value = 'An unexpected error occurred. Please try again.';
      console.error('Login error:', error);
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
        <p class="mt-2 text-sm text-bermuda-600">Sign in to access your forms dashboard</p>
      </div>

      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="space-y-4">
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

        <div v-if="loginError" class="text-red-600 text-sm text-center">
          {{ loginError }}
        </div>

        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-bermuda-500 hover:bg-bermuda-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bermuda-500"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Loading...</span>
            <span v-else>Sign in</span>
          </button>
        </div>

        <div class="text-center text-sm mt-4">
          <p>
            Don't have an account?
            <NuxtLink to="/register" class="text-bermuda-600 hover:text-bermuda-800">Create one</NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
