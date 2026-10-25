<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { CLOUD_PATH, CLOUD_VIEWBOX } from '../assets/cloud-path'
import { useParallax } from '../composables/useParallax'

/**
 * One entry per cloud bank. `index` 0 is the front-most bank (sits on the
 * bottom edge, highest z-index); higher indexes stack further back, higher up
 * the screen and behind the ones below them.
 *
 * Everything here is meant to be tweaked: colours, offsets, zoom, blur.
 */
interface CloudLayer {
  id: string
  index: number
  /** gradient top -> base in the light theme */
  light: [string, string]
  /** gradient top -> base in the dark theme */
  dark: [string, string]
  /** horizontal nudge, % of the layer's own width - breaks up the repetition */
  shift: number
  /** width multiplier - keeps the repeated silhouette from looking cloned */
  zoom: number
  /** mirror the shape horizontally, so the lobes never line up with the layer behind */
  flip: boolean
  /** px of softening; the further back a bank sits the hazier it gets */
  blur: number
  /** initial drift direction: -1 = left first, 1 = right first */
  driftDir: number
  /** full cycle duration in seconds */
  driftDuration: number
}

const DRIFT_RANGE = 65 // px of horizontal travel in each direction

const layers: CloudLayer[] = [
  {
    id: 'front',
    index: 0,
    light: ['#bda6f9', '#8f8bd4'],
    dark: ['#221a38', '#0a0810'],
    shift: 0,
    zoom: 1,
    flip: false,
    blur: 0,
    driftDir: -1,
    driftDuration: 9,
  },
  {
    id: 'near',
    index: 1,
    light: ['#cdbbfc', '#ada2e0'],
    dark: ['#2a2144', '#0f0d18'],
    shift: 3,
    zoom: 1.05,
    flip: true,
    blur: 0.4,
    driftDir: 1,
    driftDuration: 12,
  },
  {
    id: 'mid',
    index: 2,
    light: ['#ddcfff', '#c4b8ea'],
    dark: ['#332951', '#14111f'],
    shift: -2.5,
    zoom: 1.09,
    flip: false,
    blur: 0.7,
    driftDir: -1,
    driftDuration: 16,
  },
  {
    id: 'mid-far',
    index: 3,
    light: ['#e9dfff', '#d5ccf1'],
    dark: ['#3e3159', '#191527'],
    shift: 1.5,
    zoom: 1.04,
    flip: true,
    blur: 1.2,
    driftDir: 1,
    driftDuration: 21,
  },
  {
    id: 'far',
    index: 4,
    light: ['#f2ebff', '#e4dcf8'],
    dark: ['#483a66', '#1d1930'],
    shift: -1,
    zoom: 1.08,
    flip: false,
    blur: 2,
    driftDir: -1,
    driftDuration: 27,
  },
  {
    id: 'horizon',
    index: 5,
    light: ['#fbf5ea', '#f3eefb'],
    dark: ['#52426e', '#252039'],
    shift: 2,
    zoom: 1,
    flip: true,
    blur: 2.8,
    driftDir: 1,
    driftDuration: 34,
  },
]

/* ── Cursor / gyro parallax on the whole cloud bank ──────────────────── */
const { parallaxX, parallaxY } = useParallax(16, 0.05)

/* ── Scroll-based cloud reveal (large screens only) ──────────────────── */
const MAX_REVEAL = 140 // px to push the bank below its normal position
const targetOffset = ref(0)
const currentOffset = ref(0)
const isLargeScreen = ref(false)
let revealRaf = 0
let mq: MediaQueryList | null = null

function checkScreenSize() {
  if (!mq) return
  isLargeScreen.value = mq.matches
  if (mq.matches) {
    targetOffset.value = MAX_REVEAL
    currentOffset.value = MAX_REVEAL
  } else {
    targetOffset.value = 0
    currentOffset.value = 0
  }
}

function onWheel(e: WheelEvent) {
  if (!isLargeScreen.value) return
  targetOffset.value = Math.max(0, Math.min(MAX_REVEAL, targetOffset.value + e.deltaY * 0.35))
}

function tickReveal() {
  currentOffset.value += (targetOffset.value - currentOffset.value) * 0.08
  revealRaf = requestAnimationFrame(tickReveal)
}

onMounted(() => {
  mq = window.matchMedia('(min-width: 1024px)')
  checkScreenSize()
  mq.addEventListener('change', checkScreenSize)
  window.addEventListener('wheel', onWheel, { passive: true })
  revealRaf = requestAnimationFrame(tickReveal)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(revealRaf)
  mq?.removeEventListener('change', checkScreenSize)
  window.removeEventListener('wheel', onWheel)
})

/* ── Combined style for the bank wrapper ─────────────────────────────── */
const bankStyle = computed(() => ({
  transform: `translate(${parallaxX.value.toFixed(2)}px, ${(parallaxY.value + currentOffset.value).toFixed(2)}px)`,
}))

/* ── Per-layer inline styles ─────────────────────────────────────────── */
function layerStyle(layer: CloudLayer) {
  return {
    zIndex: 20 - layer.index,
    '--i': layer.index,
    '--shift': `${layer.shift}%`,
    '--zoom': layer.zoom,
    '--flip': layer.flip ? -1 : 1,
    '--blur': `${layer.blur}px`,
    '--top-light': layer.light[0],
    '--base-light': layer.light[1],
    '--top-dark': layer.dark[0],
    '--base-dark': layer.dark[1],
    '--drift-range': `${DRIFT_RANGE}px`,
    '--drift-dir': layer.driftDir,
    '--drift-duration': `${layer.driftDuration}s`,
  }
}
</script>

<template>
  <div class="cloud-bank" aria-hidden="true" :style="bankStyle">
    <svg
      v-for="layer in layers"
      :key="layer.id"
      class="cloud-layer"
      :viewBox="CLOUD_VIEWBOX"
      preserveAspectRatio="xMidYMax meet"
      :style="layerStyle(layer)"
    >
      <defs>
        <linearGradient :id="`cloud-${layer.id}`" x1="0.08" y1="0" x2="0.92" y2="1">
          <stop class="stop-top" offset="0" />
          <stop class="stop-base" offset="1" />
        </linearGradient>
      </defs>
      <path :d="CLOUD_PATH" :fill="`url(#cloud-${layer.id})`" />
      <!-- lit crest: a hairline of light along the top edge of every bank -->
      <path class="cloud-rim" :d="CLOUD_PATH" fill="none" stroke-width="2" />
    </svg>
  </div>
</template>

<style scoped>
.cloud-bank {
  --gap: clamp(18px, 2.6vw, 40px);
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 0;
  z-index: 20;
  pointer-events: none;
  will-change: transform;
}

.cloud-layer {
  position: absolute;
  left: 50%;
  bottom: calc(var(--i) * var(--gap));
  width: calc(clamp(860px, 132vw, 2600px) * var(--zoom));
  height: auto;
  transform: translateX(calc(-50% + var(--shift))) scaleX(var(--flip));
  filter: blur(var(--blur));

  /* Animation is declared HERE so Vue's scoped CSS compiler can match
     the @keyframes name to this reference. Previously it was set via
     inline :style which bypassed scoping and broke the animation. */
  animation: cloud-drift var(--drift-duration) ease-in-out infinite;
}

/* Each layer drifts left or right depending on --drift-dir (±1).
   The translate property composes independently with the transform
   above, so the positioning transform is unaffected. */
@keyframes cloud-drift {
  0%   { translate: 0 0; }
  25%  { translate: calc(var(--drift-range) * var(--drift-dir)) 0; }
  50%  { translate: 0 0; }
  75%  { translate: calc(var(--drift-range) * var(--drift-dir) * -1) 0; }
  100% { translate: 0 0; }
}
</style>
