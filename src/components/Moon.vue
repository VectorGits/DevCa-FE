<script setup lang="ts">
/** Craters taken from Moon.svg (centres and radii pulled out of the path). */
const CRATERS = [
  { cx: 139.874, cy: 191.592, r: 59.5 },
  { cx: 258.874, cy: 96.592, r: 38.08 },
  { cx: 268.874, cy: 201.592, r: 24.371 },
]
</script>

<template>
  <svg class="moon" viewBox="0 0 545 545" aria-hidden="true">
    <circle cx="272.4" cy="272.4" r="272.4" fill="#fffffa" />
    <circle
      v-for="(crater, i) in CRATERS"
      :key="i"
      :cx="crater.cx"
      :cy="crater.cy"
      :r="crater.r"
      fill="#e6e6e6"
      fill-opacity="0.3"
    />
  </svg>
</template>

<style scoped>
.moon {
  width: 100%;
  height: 100%;
}
</style>
