<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

const headingRef = ref<HTMLElement | null>(null)
const charInners = ref<HTMLElement[]>([])
const floatEls = ref<HTMLElement[]>([])

let levitateCtx: gsap.Context | null = null
const flickerTimelines: gsap.core.Timeline[] = []
const hoveredIndices = new Set<number>()

interface CharItem {
  char: string
  idx: number
}

const rawLines = [
  ['Dev', 'Career'],
  ['Frontend', 'Channel'],
]

let globalIdx = 0
const linesData: CharItem[][][] = rawLines.map((line) =>
  line.map((word) =>
    word.split('').map((char) => ({
      char,
      idx: globalIdx++,
    })),
  ),
)

/* ── Theme Cloud Colours ─────────────────────────────────────────────── */
// Derived from CloudBank.vue light layers & accents
const LIGHT_CLOUD_COLORS = [
  '#14121c', // Deep theme ink
  '#8f8bd4', // Front layer base (periwinkle)
  '#bda6f9', // Front layer top (lavender)
  '#ada2e0', // Near layer base
  '#cdbbfc', // Near layer top (lilac)
  '#c4b8ea', // Mid layer base (wisteria)
  '#ddcfff', // Mid layer top (pale lavender)
  '#d5ccf1', // Mid-far layer base
  '#e4dcf8', // Far layer base (soft violet)
  '#6b5ca8', // Deep cloud purple
  '#4d3e8c', // Twilight cloud base
]

// Derived from CloudBank.vue dark layers & rim accents
const DARK_CLOUD_COLORS = [
  '#ffffff', // Star white
  '#c4aeff', // Cloud rim crest highlight
  '#dcd4ff', // Pale twilight lilac
  '#52426e', // Horizon layer top
  '#483a66', // Far layer top
  '#3e3159', // Mid-far layer top
  '#332951', // Mid layer top
  '#2a2144', // Near layer top
  '#9d88ea', // Luminous periwinkle
  '#7562be', // Mid-tone cloud purple
]

function setCharRef(el: HTMLElement | null, idx: number) {
  if (el) {
    charInners.value[idx] = el
    if (el.parentElement) {
      floatEls.value[idx] = el.parentElement
    }
  }
}

/* ── Hover interactions ──────────────────────────────────────────────── */
function onCharEnter(idx: number) {
  hoveredIndices.add(idx)
  const inner = charInners.value[idx]
  const float = floatEls.value[idx]

  if (float) {
    float.style.zIndex = '50'
  }
  if (inner) {
    gsap.to(inner, {
      scale: 2,
      duration: 0.22,
      ease: 'back.out(2)',
      overwrite: 'auto',
    })
  }

  const tl = flickerTimelines[idx]
  if (tl) {
    tl.timeScale(2)
  }
}

function onCharLeave(idx: number) {
  hoveredIndices.delete(idx)
  const inner = charInners.value[idx]
  const float = floatEls.value[idx]

  if (inner) {
    gsap.to(inner, {
      scale: 1,
      duration: 0.32,
      ease: 'power2.out',
      overwrite: 'auto',
      onComplete: () => {
        if (!hoveredIndices.has(idx) && float) {
          float.style.zIndex = '1'
        }
      },
    })
  } else if (float) {
    float.style.zIndex = '1'
  }

  const tl = flickerTimelines[idx]
  if (tl) {
    tl.timeScale(1)
  }
}

/* ── Build non-uniform flicker timelines ─────────────────────────────── */
function buildFlickerTimelines() {
  // Clear any existing flicker timelines
  flickerTimelines.forEach((tl) => tl.kill())
  flickerTimelines.length = 0

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const colors = isDark.value ? DARK_CLOUD_COLORS : LIGHT_CLOUD_COLORS

  charInners.value.forEach((inner, idx) => {
    if (!inner) return

    const tl = gsap.timeline({ repeat: -1 })
    const stepCount = gsap.utils.random(12, 18, 1)
    let lastColor = ''

    for (let s = 0; s < stepCount; s++) {
      let nextColor: string
      do {
        nextColor = colors[Math.floor(Math.random() * colors.length)]
      } while (nextColor === lastColor && colors.length > 1)
      lastColor = nextColor

      // Staccato flicker with organic variation:
      // Mix of quick flickers (0.06s - 0.13s) and occasional holds (0.18s - 0.30s)
      const isHold = Math.random() < 0.28
      const duration = isHold
        ? gsap.utils.random(0.18, 0.3, 0.02)
        : gsap.utils.random(0.06, 0.13, 0.01)

      const opacity = Math.random() < 0.22 ? gsap.utils.random(0.8, 0.94, 0.02) : 1

      tl.to(inner, {
        color: nextColor,
        opacity,
        duration,
        ease: 'none',
      })
    }

    // Offset progress so characters flicker completely out of sync
    tl.seek(Math.random() * tl.duration())

    // If currently hovered during theme swap, preserve 2x speed
    if (hoveredIndices.has(idx)) {
      tl.timeScale(2)
    }

    flickerTimelines[idx] = tl
  })
}

/* ── Levitation (floating up/down and subtle rotation) ────────────────── */
function setupLevitation() {
  const root = headingRef.value
  if (!root) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  levitateCtx = gsap.context(() => {
    const chars = root.querySelectorAll<HTMLElement>('.char-float')
    if (!chars) return

    chars.forEach((char) => {
      // 1. Vertical float - non-uniform amplitude, direction, duration
      const yDistance = gsap.utils.random(4, 8.5, 0.5)
      const yDir = Math.random() > 0.5 ? 1 : -1
      const durationY = gsap.utils.random(2.2, 3.8, 0.1)

      const tweenY = gsap.to(char, {
        y: yDir * yDistance,
        duration: durationY,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
      tweenY.progress(Math.random())

      // 2. Subtle rotation left and right - decoupled duration for organic Lissajous drift
      const rotAngle = gsap.utils.random(2.5, 5, 0.2)
      const rotDir = Math.random() > 0.5 ? 1 : -1
      const durationRot = gsap.utils.random(2.6, 4.4, 0.1)

      const tweenRot = gsap.to(char, {
        rotation: rotDir * rotAngle,
        transformOrigin: '50% 50%',
        duration: durationRot,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
      tweenRot.progress(Math.random())
    })
  }, root)
}

onMounted(() => {
  setupLevitation()
  buildFlickerTimelines()
})

watch(isDark, () => {
  buildFlickerTimelines()
})

onBeforeUnmount(() => {
  levitateCtx?.revert()
  flickerTimelines.forEach((tl) => tl.kill())
  flickerTimelines.length = 0
})
</script>

<template>
  <h1
    ref="headingRef"
    class="text-3xl min-[420px]:text-4xl font-bold text-[#14121c] sm:text-6xl dark:text-white lg:leading-[1.18] select-none"
    aria-label="Dev Career Frontend Channel"
  >
    <span
      v-for="(line, lineIdx) in linesData"
      :key="lineIdx"
      class="inline lg:block"
    >
      <template v-for="(word, wordIdx) in line" :key="wordIdx">
        <span class="inline-block whitespace-nowrap">
          <span
            v-for="item in word"
            :key="item.idx"
            class="char-float inline-block will-change-transform"
          >
            <span
              :ref="(el) => setCharRef(el as HTMLElement, item.idx)"
              class="char-inner inline-block will-change-transform cursor-pointer"
              @pointerenter="onCharEnter(item.idx)"
              @pointerleave="onCharLeave(item.idx)"
            >{{ item.char }}</span>
          </span>
        </span>
        <!-- Spacing between words on the same line -->
        <span
          v-if="wordIdx < line.length - 1"
          class="inline-block w-[0.28em]"
          aria-hidden="true"
        >&nbsp;</span>
      </template>
      <!-- Space between line 1 and line 2 when flowing inline on small screens -->
      <span
        v-if="lineIdx < linesData.length - 1"
        class="inline lg:hidden w-[0.28em]"
        aria-hidden="true"
      >&nbsp;</span>
    </span>
  </h1>
</template>

<style scoped>
.char-float {
  position: relative;
  display: inline-block;
  transform-origin: center center;
  z-index: 1;
}

.char-inner {
  position: relative;
  display: inline-block;
  transform-origin: center center;
  user-select: none;
}
</style>
