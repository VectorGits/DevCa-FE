<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Celestial from './components/Celestial.vue'
import CloudBank from './components/CloudBank.vue'
import GyroPermission from './components/GyroPermission.vue'
import FloatingHeroTitle from './components/FloatingHeroTitle.vue'
import InfoModal from './components/InfoModal.vue'

const isInfoOpen = ref(false)

onMounted(() => {
  try {
    const hasSeen = localStorage.getItem('devca-seen-theme-hint')
    if (!hasSeen) {
      isInfoOpen.value = true
    }
  } catch {
    // In restricted iframe/private storage mode, default to showing
    isInfoOpen.value = true
  }
})
</script>

<template>
  <main class="sky relative min-h-svh overflow-hidden">
    <Celestial />
    <CloudBank />
    <GyroPermission />
    <InfoModal v-model="isInfoOpen" />

    <div class="pointer-events-none relative z-30 flex min-h-svh flex-col items-center justify-center gap-8 px-6 text-center lg:items-start lg:text-left lg:px-16 xl:px-24">
      <div class="pointer-events-auto">
        <FloatingHeroTitle />
      </div>

      <button
        type="button"
        class="pointer-events-auto group flex h-11 w-11 items-center justify-center rounded-full border border-[#14121c]/20 bg-white/40 text-[#14121c] shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-[#14121c]/40 hover:bg-white/70 active:scale-95 dark:border-white/25 dark:bg-white/10 dark:text-white dark:hover:border-white/50 dark:hover:bg-white/20"
        aria-label="Information"
        title="Information: Click the Sun/Moon to switch themes"
        @click="isInfoOpen = true"
      >
        <svg
          class="h-5 w-5 transition-transform duration-200 group-hover:rotate-12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </button>
    </div>
  </main>
</template>

