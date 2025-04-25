<template>
  <div class="flex items-center justify-center lg:mt-40 mt-20 bg-bermuda-50">
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
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-bermuda-700">Password</label>
            <input id="password" type="password" v-model="password" required class="form-input" />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-bermuda-500 hover:bg-bermuda-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bermuda-500"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const email = ref('');
const password = ref('');

function handleLogin() {
  // In a real app, this would validate credentials
  // Using dummy values for now
  if (email.value && password.value) {
    router.push('/websites');
  }
}
</script>
