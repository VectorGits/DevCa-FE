<script setup lang="ts">
import { computed } from 'vue'
import Moon from './Moon.vue'
import Sun from './Sun.vue'
import { useTheme } from '../composables/useTheme'
import { useParallax } from '../composables/useParallax'

const { isDark } = useTheme()
const { parallaxX, parallaxY } = useParallax(16, 0.07)

const parallaxStyle = computed(() => ({
  transform: `translate(${parallaxX.value.toFixed(2)}px, ${parallaxY.value.toFixed(2)}px)`,
}))
</script>

<template>
  <div class="celestial" aria-hidden="true" :style="parallaxStyle">
    <div class="halo" :class="isDark ? 'halo-moon' : 'halo-sun'" />

    <Transition name="swap">
      <Moon v-if="isDark" key="moon" class="body" />
      <Sun v-else key="sun" class="body" />
    </Transition>
  </div>
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
  pointer-events: none;
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
