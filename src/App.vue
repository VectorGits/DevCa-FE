<script setup lang="ts">
import { ref } from 'vue'
import CloudBank from './components/CloudBank.vue'

// Placeholder theme state - the real switch (sun / moon) comes later.
const isDark = ref(true)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<template>
  <main class="sky relative min-h-svh overflow-hidden">
    <CloudBank />

    <div class="relative z-30 flex min-h-svh flex-col items-center justify-center gap-8 px-6 text-center">
      <h1 class="text-4xl font-bold text-[#14121c] sm:text-6xl dark:text-white">
        Dev Career Frontend Channel
      </h1>

      <button
        type="button"
        class="rounded-full border border-[#14121c]/20 px-5 py-2 text-sm text-[#14121c] transition-colors hover:bg-[#14121c]/5 dark:border-white/25 dark:text-white dark:hover:bg-white/10"
        :aria-pressed="isDark"
        @click="toggleTheme"
      >
        {{ isDark ? 'Dark mode: on' : 'Dark mode: off' }}
      </button>
    </div>
  </main>
</template>
