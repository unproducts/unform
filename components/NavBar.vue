<template>
  <nav class="bg-white shadow-md">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <NuxtLink to="/websites" class="text-2xl font-bold text-bermuda-600 flex items-center gap-2">
            <img src="~/assets/icon.svg" alt="Unform Logo" class="w-10 h-10" />
            Unform
          </NuxtLink>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-bermuda-800">{{ user.name }}</span>
          <button
            @click="logout"
            class="px-4 py-2 rounded text-sm text-white bg-bermuda-500 hover:bg-bermuda-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
// In a real app, this would come from authentication state
const user = reactive({
  name: 'Admin User',
});

const router = useRouter();

function logout() {
  // In a real app, this would clear authentication state
  router.push('/login');
}
</script>
