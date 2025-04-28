<template>
  <div class="min-h-screen bg-gradient-to-b from-bermuda-50 to-white">
    <!-- Hero Section -->
    <div class="container mx-auto px-4 py-8 md:py-12">
      <div class="text-center max-w-4xl mx-auto">
        <div class="flex items-center justify-center mb-4 md:mb-6">
          <img src="~/assets/icon.png" alt="Unform Logo" class="h-12 w-12 mr-2 md:mr-3" />
          <h1 class="text-4xl font-bold text-bermuda-600">Unform</h1>
        </div>
        <h2 class="text-xl md:text-3xl font-bold text-bermuda-600 mb-3 md:mb-4">
          Open Source Alternative to Formspree
        </h2>
        <p class="text-base md:text-lg text-bermuda-700 mb-4 md:mb-6">
          Host forms, collect submissions, and manage your data - all for free.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
          <NuxtLink
            to="/login"
            class="px-4 md:px-6 py-2 md:py-3 bg-bermuda-500 text-white rounded-lg hover:bg-bermuda-600 transition-colors duration-200 text-sm md:text-base font-semibold shadow-md"
          >
            Get Started Free
          </NuxtLink>
          <a
            href="#features"
            class="px-4 md:px-6 py-2 md:py-3 border-2 border-bermuda-500 text-bermuda-500 rounded-lg hover:bg-bermuda-50 transition-colors duration-200 text-sm md:text-base font-semibold"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>

    <!-- Flow Diagram Section -->
    <div class="container mx-auto px-4 py-6 md:py-8">
      <div class="max-w-5xl mx-auto bg-white rounded-xl p-4 md:p-8 shadow-lg border border-bermuda-100">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          <!-- Left Side - Form Submissions -->
          <div class="text-center w-full md:w-1/3">
            <div class="bg-bermuda-50 rounded-lg p-3 md:p-4">
              <div class="text-2xl md:text-3xl mb-2">📝</div>
              <h3 class="font-semibold text-bermuda-600 text-base md:text-lg">Form Submissions</h3>
              <p class="text-xs md:text-sm text-bermuda-700 mt-2">Users submit data through your forms</p>
            </div>
          </div>

          <!-- Center - Unform Processing -->
          <div class="relative text-center w-full md:w-1/3">
            <div class="">
              <div class="absolute inset-0 bg-bermuda-100 rounded-full blur-lg animate-pulse"></div>
              <div
                class="relative bg-bermuda-100 rounded-full p-3 md:p-4 mx-auto w-16 h-16 md:w-24 md:h-24 flex items-center justify-center"
              >
                <img src="~/assets/icon.png" alt="Unform Logo" class="h-8 w-8 md:h-12 md:w-12" />
              </div>
            </div>
            <h3 class="font-semibold text-bermuda-600 mt-3 md:mt-4 text-base md:text-lg">Unform</h3>
            <p class="text-xs md:text-sm text-bermuda-700">Processes & Secures Your Data</p>
          </div>

          <!-- Right Side - Integrations -->
          <div class="text-center w-full md:w-1/3">
            <div class="bg-bermuda-50 rounded-lg p-3 md:p-4">
              <div class="flex justify-center gap-3 md:gap-4 mb-2">
                <div class="text-xl md:text-2xl">📧</div>
                <div class="text-xl md:text-2xl">🔔</div>
                <div class="text-xl md:text-2xl">📊</div>
              </div>
              <h3 class="font-semibold text-bermuda-600 text-base md:text-lg">Integrations</h3>
              <p class="text-xs md:text-sm text-bermuda-700 mt-2">Email notifications, webhooks, and more</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="bg-white py-8 md:py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-xl md:text-2xl font-bold text-center text-bermuda-600 mb-6 md:mb-8">Why Choose Unform?</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <div class="p-4 md:p-5 rounded-lg bg-bermuda-50 border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-2xl md:text-3xl mb-2 md:mb-3">∞</div>
            <h3 class="text-base md:text-lg font-semibold mb-2">Unlimited Forms</h3>
            <p class="text-xs md:text-sm text-bermuda-700">
              Create as many forms as you need without any restrictions or hidden costs.
            </p>
          </div>
          <div class="p-4 md:p-5 rounded-lg bg-bermuda-50 border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-2xl md:text-3xl mb-2 md:mb-3">🔒</div>
            <h3 class="text-base md:text-lg font-semibold mb-2">Secure & Private</h3>
            <p class="text-xs md:text-sm text-bermuda-700">
              Your form submissions are encrypted and stored securely. Your data stays private.
            </p>
          </div>
          <div class="p-4 md:p-5 rounded-lg bg-bermuda-50 border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-2xl md:text-3xl mb-2 md:mb-3">⚡</div>
            <h3 class="text-base md:text-lg font-semibold mb-2">Lightning Fast</h3>
            <p class="text-xs md:text-sm text-bermuda-700">
              Built with performance in mind. Your forms load quickly and submit instantly.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Benefits Section -->
    <div class="bg-bermuda-50 py-8 md:py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-xl md:text-2xl font-bold text-center text-bermuda-600 mb-6 md:mb-8">Everything You Need</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          <div class="flex items-start gap-3 p-3 md:p-4 rounded-lg bg-white border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-lg md:text-xl">✓</div>
            <div>
              <h3 class="text-base md:text-lg font-semibold mb-1">Free Forever</h3>
              <p class="text-xs md:text-sm text-bermuda-700">
                No credit card required. Start using Unform today without any costs.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 md:p-4 rounded-lg bg-white border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-lg md:text-xl">✓</div>
            <div>
              <h3 class="text-base md:text-lg font-semibold mb-1">Easy Integration</h3>
              <p class="text-xs md:text-sm text-bermuda-700">
                Simple copy-paste code to add forms to any website or application.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 md:p-4 rounded-lg bg-white border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-lg md:text-xl">✓</div>
            <div>
              <h3 class="text-base md:text-lg font-semibold mb-1">Email Notifications</h3>
              <p class="text-xs md:text-sm text-bermuda-700">
                Get instant notifications when someone submits your form.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 md:p-4 rounded-lg bg-white border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-lg md:text-xl">✓</div>
            <div>
              <h3 class="text-base md:text-lg font-semibold mb-1">Data Export</h3>
              <p class="text-xs md:text-sm text-bermuda-700">
                Export your form submissions in various formats for easy analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Open Source Section -->
    <div class="bg-white py-8 md:py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-xl md:text-2xl font-bold text-center text-bermuda-600 mb-6 md:mb-8">
          Open Source & Community Driven
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          <div class="p-4 md:p-5 rounded-lg bg-bermuda-50 border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-2xl md:text-3xl mb-2 md:mb-3">🌟</div>
            <h3 class="text-base md:text-lg font-semibold mb-2">Open Source</h3>
            <p class="text-xs md:text-sm text-bermuda-700">
              Unform is completely open source, giving you full control and transparency over your form management
              solution.
            </p>
          </div>
          <div class="p-4 md:p-5 rounded-lg bg-bermuda-50 border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-2xl md:text-3xl mb-2 md:mb-3">👥</div>
            <h3 class="text-base md:text-lg font-semibold mb-2">Community Driven</h3>
            <p class="text-xs md:text-sm text-bermuda-700">
              Built and maintained by a community of developers who believe in open, accessible form management.
            </p>
          </div>
          <div class="p-4 md:p-5 rounded-lg bg-bermuda-50 border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-2xl md:text-3xl mb-2 md:mb-3">🔧</div>
            <h3 class="text-base md:text-lg font-semibold mb-2">Customizable</h3>
            <p class="text-xs md:text-sm text-bermuda-700">
              Fork, modify, and customize Unform to fit your specific needs. The code is yours to use and improve.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contributions Section -->
    <div class="bg-bermuda-50 py-8 md:py-12">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-xl md:text-2xl font-bold text-bermuda-600 mb-3 md:mb-4">Join Our Community</h2>
        <p class="text-base md:text-lg text-bermuda-700 mb-4 md:mb-6 max-w-2xl mx-auto">
          Help us make Unform even better! Whether you're a developer, designer, or documentation writer, your
          contributions are welcome.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
          <a
            href="https://github.com/unproducts/unform"
            target="_blank"
            class="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-bermuda-500 text-white rounded-lg hover:bg-bermuda-600 transition-colors duration-200 text-sm md:text-base font-semibold shadow-md"
          >
            <span class="mr-2">⭐</span>
            Star on GitHub
          </a>
          <a
            href="https://github.com/unproducts/unform/blob/main/CONTRIBUTING.md"
            target="_blank"
            class="inline-flex items-center px-4 md:px-6 py-2 md:py-3 border-2 border-bermuda-500 text-bermuda-500 rounded-lg hover:bg-bermuda-50 transition-colors duration-200 text-sm md:text-base font-semibold"
          >
            <span class="mr-2">🤝</span>
            Contribute
          </a>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-white py-8 md:py-12">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-xl md:text-2xl font-bold text-bermuda-600 mb-3 md:mb-4">Ready to Get Started?</h2>
        <p class="text-base md:text-lg text-bermuda-700 mb-4 md:mb-6 max-w-2xl mx-auto">
          Join thousands of users who trust Unform for their form management needs.
        </p>
        <NuxtLink
          to="/login"
          class="inline-block px-4 md:px-6 py-2 md:py-3 bg-bermuda-500 text-white rounded-lg hover:bg-bermuda-600 transition-colors duration-200 text-sm md:text-base font-semibold shadow-md"
        >
          Create Your First Form
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Add any necessary script setup here
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
