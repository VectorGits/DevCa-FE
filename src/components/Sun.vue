<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'

/**
 * Sun tones - one new disc grows out from behind the sun every step, so the
 * colour reads as morning -> noon -> dusk -> twilight, then loops.
 */
const TONES = ['#ffdf8a', '#ff8f1f', '#ff6f4d', '#f26a94']
const CORE = '#ffc02e'

/** one gradient + one circle per tone; the id keeps the two lists in step */
const DISCS = TONES.map((tone, i) => ({ tone, id: `sun-tone-${i}` }))

/** seconds between new discs */
const STEP = 1.2
/** how long a single disc takes to grow and fade */
const GROW = STEP

const root = ref<SVGSVGElement | null>(null)
const tweens: gsap.core.Timeline[] = []

onMounted(() => {
  const svg = root.value
  if (!svg) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const discs = Array.from(svg.querySelectorAll<SVGCircleElement>('.sun-disc'))

  // One timeline for all four discs, each starting a step later than the one
  // before it. Total cycle = TONES.length * STEP, so the colours always come
  // round in order (morning -> noon -> dusk -> twilight) with no repeats and no
  // dead air. Separate per-disc timelines with a delay would alias: a disc
  // delayed by one full cycle lands in phase with the first one.
  const tl = gsap.timeline({ repeat: -1 })
  discs.forEach((disc, i) => {
    gsap.set(disc, { transformOrigin: '50% 50%', scale: 0.96, opacity: 0 })
    // scale and fade are split so the disc keeps its colour while it is expanding
    // past the sun's edge, instead of washing out almost immediately.
    tl.fromTo(
      disc,
      { scale: 0.96 },
      { scale: 2.1, duration: GROW, ease: 'power1.out', immediateRender: false },
      i * STEP,
    ).fromTo(
      disc,
      { opacity: 0.6 },
      { opacity: 0, duration: GROW, ease: 'power1.in', immediateRender: false },
      i * STEP,
    )
  })
  tweens.push(tl)
})

onBeforeUnmount(() => {
  tweens.forEach((tl) => tl.kill())
  tweens.length = 0
})
</script>

<template>
  <svg ref="root" class="sun" viewBox="0 0 545 545" aria-hidden="true">
    <defs>
      <!-- each tone fades out at its own edge so the growing disc reads as light,
           not as a flat ring with a hard vector outline -->
      <radialGradient v-for="disc in DISCS" :id="disc.id" :key="disc.id">
        <stop offset="62%" :stop-color="disc.tone" />
        <stop offset="100%" :stop-color="disc.tone" stop-opacity="0" />
      </radialGradient>
    </defs>

    <g class="sun-discs">
      <circle
        v-for="disc in DISCS"
        :key="disc.id"
        class="sun-disc"
        cx="272.4"
        cy="272.4"
        r="272.4"
        :fill="`url(#${disc.id})`"
      />
    </g>

    <circle cx="272.4" cy="272.4" r="272.4" :fill="CORE" />
  </svg>
</template>

<style scoped>
.sun {
  width: 100%;
  height: 100%;
  overflow: visible; /* the discs grow past the sun's own box */
}

.sun-discs {
  filter: blur(7px);
}
</style>
