<script setup lang="ts">
import { computed } from 'vue'
import Moon from './Moon.vue'
import Sun from './Sun.vue'
import { useTheme } from '../composables/useTheme'
import { useParallax } from '../composables/useParallax'

const { isDark, toggleTheme } = useTheme()
const { parallaxX, parallaxY } = useParallax(16, 0.07)

const parallaxStyle = computed(() => ({
  transform: `translate(${parallaxX.value.toFixed(2)}px, ${parallaxY.value.toFixed(2)}px)`,
}))
</script>

<template>
  <button
    type="button"
    class="celestial"
    :style="parallaxStyle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="isDark ? 'Click the Moon to switch to light mode' : 'Click the Sun to switch to dark mode'"
    @click="toggleTheme"
  >
    <div class="celestial-inner">
      <div class="halo" :class="isDark ? 'halo-moon' : 'halo-sun'" />

      <Transition name="swap">
        <Moon v-if="isDark" key="moon" class="body" />
        <Sun v-else key="sun" class="body" />
      </Transition>
    </div>
  </button>
</template>

<style scoped>
/* Top-right corner. Shrink `--size` / raise the top/right values to pull it in;
   the mobile rule below lets it hang off the corner a little. */
.celestial {
  --size: clamp(132px, 17vw, 262px);

  position: absolute;
  top: clamp(20px, 4.5vw, 88px);
  right: clamp(20px, 4.5vw, 88px);
  width: var(--size);
  aspect-ratio: 1;
  z-index: 5; /* behind the cloud banks (z-index: 20) */
  pointer-events: auto;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0;
  outline: none;
  border-radius: 9999px;
}

.celestial-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  transition: transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1), filter 300ms ease;
}

.celestial:hover .celestial-inner {
  transform: scale(1.05);
  filter: brightness(1.08);
}

.celestial:active .celestial-inner {
  transform: scale(0.95);
}

.halo {
  position: absolute;
  inset: -48%;
  border-radius: 9999px;
  filter: blur(16px);
}

.halo-sun {
  background: radial-gradient(
    circle,
    rgb(255 183 0 / 0.45) 0%,
    rgb(255 183 0 / 0.18) 40%,
    rgb(255 183 0 / 0) 70%
  );
}

.halo-moon {
  background: radial-gradient(
    circle,
    rgb(214 205 255 / 0.32) 0%,
    rgb(190 180 255 / 0.12) 46%,
    rgb(190 180 255 / 0) 74%
  );
}

.body {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 420ms ease,
    transform 620ms cubic-bezier(0.16, 1, 0.3, 1);
}

.swap-enter-from {
  opacity: 0;
  transform: scale(0.88) rotate(-8deg);
}

.swap-leave-to {
  opacity: 0;
  transform: scale(1.08);
}

@media (max-width: 480px) {
  .celestial {
    --size: 132px;
    top: -22px;
    right: -18px;
  }
}
</style>
