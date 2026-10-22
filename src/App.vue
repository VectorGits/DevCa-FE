<script setup lang="ts">
import { ref } from 'vue'

// Placeholder state — the real flicker animation (GSAP) and theme logic come next.
const isDark = ref(true)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<template>
  <main
    class="flex min-h-svh flex-col items-center justify-center gap-10 bg-white px-6 text-black dark:bg-black dark:text-white"
  >
    <h1 class="text-center text-4xl font-bold sm:text-6xl">Dev Career Frontend Channel</h1>

    <button
      type="button"
      class="rounded-full border border-current px-5 py-2 text-sm"
      :aria-pressed="isDark"
      @click="toggleTheme"
    >
      {{ isDark ? 'Dark mode: on' : 'Dark mode: off' }}
    </button>
  </main>
</template>
