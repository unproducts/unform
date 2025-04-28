<template>
  <div class="min-h-screen bg-gradient-to-b from-bermuda-50 to-white">
    <!-- Hero Section -->
    <div class="container mx-auto px-4 py-12">
      <div class="text-center max-w-4xl mx-auto">
        <div class="flex items-center justify-center mb-6">
          <img src="~/assets/icon.png" alt="Unform Logo" class="h-12 w-12 mr-3" />
          <h1 class="text-4xl font-bold text-bermuda-600">Unform</h1>
        </div>
        <h2 class="text-3xl font-bold text-bermuda-600 mb-4">The Open Source Alternative to Formspree</h2>
        <p class="text-lg text-bermuda-700 mb-6">
          Host unlimited forms, collect submissions, and manage your data - all for free.
        </p>
        <div class="flex justify-center gap-4">
          <NuxtLink
            to="/login"
            class="px-6 py-3 bg-bermuda-500 text-white rounded-lg hover:bg-bermuda-600 transition-colors duration-200 text-base font-semibold shadow-md"
          >
            Get Started Free
          </NuxtLink>
          <a
            href="#features"
            class="px-6 py-3 border-2 border-bermuda-500 text-bermuda-500 rounded-lg hover:bg-bermuda-50 transition-colors duration-200 text-base font-semibold"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>

    <!-- Flow Diagram Section -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-5xl mx-auto bg-white rounded-xl p-8 shadow-lg border border-bermuda-100">
        <div class="flex items-center justify-between">
          <!-- Left Side - Form Submissions -->
          <div class="text-center w-1/3">
            <div class="bg-bermuda-50 rounded-lg p-4">
              <div class="text-3xl mb-2">📝</div>
              <h3 class="font-semibold text-bermuda-600">Form Submissions</h3>
              <p class="text-sm text-bermuda-700 mt-2">Users submit data through your forms</p>
            </div>
          </div>

          <!-- Center - Unform Processing -->
          <div class="relative text-center w-1/3">
            <div class="">
              <div class="absolute inset-0 bg-bermuda-100 rounded-full blur-lg animate-pulse"></div>
              <div class="relative bg-bermuda-100 rounded-full p-4 mx-auto w-24 h-24 flex items-center justify-center">
                <img src="~/assets/icon.png" alt="Unform Logo" class="h-12 w-12" />
              </div>
            </div>
            <h3 class="font-semibold text-bermuda-600 mt-4">Unform</h3>
            <p class="text-sm text-bermuda-700">Processes & Secures Your Data</p>
          </div>

          <!-- Right Side - Integrations -->
          <div class="text-center w-1/3">
            <div class="bg-bermuda-50 rounded-lg p-4">
              <div class="flex justify-center gap-4 mb-2">
                <div class="text-2xl">📧</div>
                <div class="text-2xl">🔔</div>
                <div class="text-2xl">📊</div>
              </div>
              <h3 class="font-semibold text-bermuda-600">Integrations</h3>
              <p class="text-sm text-bermuda-700 mt-2">Email notifications, webhooks, and more</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="bg-white py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-center text-bermuda-600 mb-8">Why Choose Unform?</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="p-5 rounded-lg bg-bermuda-50 border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-3xl mb-3">∞</div>
            <h3 class="text-lg font-semibold mb-2">Unlimited Forms</h3>
            <p class="text-bermuda-700 text-sm">
              Create as many forms as you need without any restrictions or hidden costs.
            </p>
          </div>
          <div class="p-5 rounded-lg bg-bermuda-50 border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-3xl mb-3">🔒</div>
            <h3 class="text-lg font-semibold mb-2">Secure & Private</h3>
            <p class="text-bermuda-700 text-sm">
              Your form submissions are encrypted and stored securely. Your data stays private.
            </p>
          </div>
          <div class="p-5 rounded-lg bg-bermuda-50 border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-3xl mb-3">⚡</div>
            <h3 class="text-lg font-semibold mb-2">Lightning Fast</h3>
            <p class="text-bermuda-700 text-sm">
              Built with performance in mind. Your forms load quickly and submit instantly.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Benefits Section -->
    <div class="bg-bermuda-50 py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-center text-bermuda-600 mb-8">Everything You Need</h2>
        <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div class="flex items-start gap-3 p-4 rounded-lg bg-white border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-xl">✓</div>
            <div>
              <h3 class="text-lg font-semibold mb-1">Free Forever</h3>
              <p class="text-bermuda-700 text-sm">
                No credit card required. Start using Unform today without any costs.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-4 rounded-lg bg-white border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-xl">✓</div>
            <div>
              <h3 class="text-lg font-semibold mb-1">Easy Integration</h3>
              <p class="text-bermuda-700 text-sm">Simple copy-paste code to add forms to any website or application.</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-4 rounded-lg bg-white border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-xl">✓</div>
            <div>
              <h3 class="text-lg font-semibold mb-1">Email Notifications</h3>
              <p class="text-bermuda-700 text-sm">Get instant notifications when someone submits your form.</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-4 rounded-lg bg-white border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-xl">✓</div>
            <div>
              <h3 class="text-lg font-semibold mb-1">Data Export</h3>
              <p class="text-bermuda-700 text-sm">Export your form submissions in various formats for easy analysis.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Open Source Section -->
    <div class="bg-white py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-center text-bermuda-600 mb-8">Open Source & Community Driven</h2>
        <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div class="p-5 rounded-lg bg-bermuda-50 border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-3xl mb-3">🌟</div>
            <h3 class="text-lg font-semibold mb-2">Open Source</h3>
            <p class="text-bermuda-700 text-sm">
              Unform is completely open source, giving you full control and transparency over your form management
              solution.
            </p>
          </div>
          <div class="p-5 rounded-lg bg-bermuda-50 border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-3xl mb-3">👥</div>
            <h3 class="text-lg font-semibold mb-2">Community Driven</h3>
            <p class="text-bermuda-700 text-sm">
              Built and maintained by a community of developers who believe in open, accessible form management.
            </p>
          </div>
          <div class="p-5 rounded-lg bg-bermuda-50 border border-bermuda-100 shadow-sm">
            <div class="text-bermuda-500 text-3xl mb-3">🔧</div>
            <h3 class="text-lg font-semibold mb-2">Customizable</h3>
            <p class="text-bermuda-700 text-sm">
              Fork, modify, and customize Unform to fit your specific needs. The code is yours to use and improve.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contributions Section -->
    <div class="bg-bermuda-50 py-12">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-2xl font-bold text-bermuda-600 mb-4">Join Our Community</h2>
        <p class="text-lg text-bermuda-700 mb-6 max-w-2xl mx-auto">
          Help us make Unform even better! Whether you're a developer, designer, or documentation writer, your
          contributions are welcome.
        </p>
        <div class="flex justify-center gap-4">
          <a
            href="https://github.com/unproducts/unform"
            target="_blank"
            class="inline-flex items-center px-6 py-3 bg-bermuda-500 text-white rounded-lg hover:bg-bermuda-600 transition-colors duration-200 text-base font-semibold shadow-md"
          >
            <span class="mr-2">⭐</span>
            Star on GitHub
          </a>
          <a
            href="https://github.com/unproducts/unform/blob/main/CONTRIBUTING.md"
            target="_blank"
            class="inline-flex items-center px-6 py-3 border-2 border-bermuda-500 text-bermuda-500 rounded-lg hover:bg-bermuda-50 transition-colors duration-200 text-base font-semibold"
          >
            <span class="mr-2">🤝</span>
            Contribute
          </a>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-white py-12">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-2xl font-bold text-bermuda-600 mb-4">Ready to Get Started?</h2>
        <p class="text-lg text-bermuda-700 mb-6 max-w-2xl mx-auto">
          Join thousands of users who trust Unform for their form management needs.
        </p>
        <NuxtLink
          to="/login"
          class="inline-block px-6 py-3 bg-bermuda-500 text-white rounded-lg hover:bg-bermuda-600 transition-colors duration-200 text-base font-semibold shadow-md"
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
