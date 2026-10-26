<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Celestial from './components/Celestial.vue'
import CloudBank from './components/CloudBank.vue'
import GyroPermission from './components/GyroPermission.vue'
import FloatingHeroTitle from './components/FloatingHeroTitle.vue'
import InfoModal from './components/InfoModal.vue'

const isInfoOpen = ref(false)

/**
 * Social profile links - customize these URLs as desired
 */
const socialLinks = {
  x: 'https://x.com/Vect0r_x',
  linkedin: 'https://www.linkedin.com/in/vect0r/',
  mail: 'mailto:davidoluremi0@gmail.com',
}

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

      <!-- Info Button: circled with Cloud-Circle.svg -->
      <button
        type="button"
        class="pointer-events-auto group relative flex items-center justify-center p-1 transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Information"
        title="Information: Click the Sun/Moon to switch themes"
        @click="isInfoOpen = true"
      >
        <svg
          class="h-12 w-13 sm:h-13 sm:w-14 transition-transform duration-200 group-hover:rotate-6 drop-shadow-[0_2px_6px_rgba(20,18,28,0.12)] dark:drop-shadow-[0_0_10px_rgba(196,174,255,0.5)]"
          viewBox="0 0 722 660"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Cloud-Circle path from src/assets/Cloud-Circle.svg -->
          <g transform="matrix(1,0,0,1,-1015.472334,-437.756893)">
            <g id="Cloud-Circle">
              <path
                d="M1090.006,913.603C1049.265,900.383 1019.722,861.516 1019.722,815.68C1019.722,777.003 1040.757,743.289 1071.805,725.758C1061.559,711.698 1055.496,694.294 1055.496,675.459C1055.496,628.8 1092.704,590.918 1138.534,590.918C1138.775,590.918 1139.015,590.919 1139.256,590.921C1138.78,587.262 1138.534,583.528 1138.534,579.737C1138.534,533.078 1175.742,495.196 1221.572,495.196C1239.38,495.196 1255.887,500.916 1269.414,510.648C1289.481,469.958 1330.852,442.007 1378.586,442.007C1428.506,442.007 1471.468,472.579 1490.38,516.32C1504.154,509.825 1519.496,506.2 1535.663,506.2C1595.256,506.2 1643.638,555.458 1643.638,616.129C1643.638,622.85 1643.044,629.431 1641.907,635.821C1680.179,639.902 1710.051,672.891 1710.051,712.929C1710.051,734.99 1700.981,754.911 1686.434,769.035C1714.166,788.352 1732.378,820.817 1732.378,857.577C1732.378,916.747 1685.194,964.785 1627.076,964.785C1626.502,964.785 1625.928,964.78 1625.356,964.771C1616.384,1014.7 1573.391,1052.593 1521.774,1052.593C1497.98,1052.593 1476.018,1044.541 1458.377,1030.969C1438.87,1068.113 1400.398,1093.408 1356.169,1093.408C1308.37,1093.408 1267.295,1063.864 1249.615,1021.749C1232.454,1035.485 1210.818,1043.681 1187.316,1043.681C1131.614,1043.681 1086.392,997.639 1086.392,940.929C1086.392,931.469 1087.65,922.305 1090.006,913.603Z"
                class="stroke-[#61668d] dark:stroke-[#c4aeff] transition-colors duration-200"
                stroke-width="8.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </g>
          <!-- Info "i" centered inside the Cloud Circle -->
          <circle
            cx="360.5"
            cy="235"
            r="20"
            class="fill-[#61668d] dark:fill-[#c4aeff] transition-colors duration-200"
          />
          <line
            x1="360.5"
            y1="300"
            x2="360.5"
            y2="465"
            class="stroke-[#61668d] dark:stroke-[#c4aeff] transition-colors duration-200"
            stroke-width="36"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>

    <!-- Social Links: X, LinkedIn, Mail side-by-side at the bottom of the page -->
    <nav
      class="pointer-events-auto absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center gap-5 sm:gap-7"
      aria-label="Social links"
    >
      <a
        :href="socialLinks.x"
        target="_blank"
        rel="noopener noreferrer"
        class="social-link group flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:scale-110 active:scale-95"
        aria-label="X (formerly Twitter)"
        title="X (formerly Twitter)"
      >
        <img
          src="./assets/X-Icon.svg"
          alt="X"
          class="h-full w-full object-contain drop-shadow-[0_2px_6px_rgba(20,18,28,0.12)] transition-transform duration-200 group-hover:rotate-6 dark:brightness-140 dark:drop-shadow-[0_0_10px_rgba(196,174,255,0.5)]"
        />
      </a>

      <a
        :href="socialLinks.linkedin"
        target="_blank"
        rel="noopener noreferrer"
        class="social-link group flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:scale-110 active:scale-95"
        aria-label="LinkedIn"
        title="LinkedIn"
      >
        <img
          src="./assets/LinkedIn-Icon.svg"
          alt="LinkedIn"
          class="h-full w-full object-contain drop-shadow-[0_2px_6px_rgba(20,18,28,0.12)] transition-transform duration-200 group-hover:-rotate-6 dark:brightness-140 dark:drop-shadow-[0_0_10px_rgba(196,174,255,0.5)]"
        />
      </a>

      <a
        :href="socialLinks.mail"
        target="_blank"
        rel="noopener noreferrer"
        class="social-link group flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:scale-110 active:scale-95"
        aria-label="Email"
        title="Email"
      >
        <img
          src="./assets/Mail-Icon.svg"
          alt="Email"
          class="h-full w-full object-contain drop-shadow-[0_2px_6px_rgba(156,47,48,0.18)] transition-transform duration-200 group-hover:rotate-6 dark:brightness-130 dark:drop-shadow-[0_0_10px_rgba(246,120,114,0.5)]"
        />
      </a>
    </nav>
  </main>
</template>

