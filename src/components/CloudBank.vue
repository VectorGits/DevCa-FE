<script setup lang="ts">
import { CLOUD_PATH, CLOUD_VIEWBOX } from '../assets/cloud-path'

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
}

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
  },
]

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
  }
}
</script>

<template>
  <div class="cloud-bank" aria-hidden="true">
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
  pointer-events: none;
}

.cloud-layer {
  position: absolute;
  left: 50%;
  bottom: calc(var(--i) * var(--gap));
  width: calc(clamp(860px, 132vw, 2600px) * var(--zoom));
  height: auto;
  transform: translateX(calc(-50% + var(--shift))) scaleX(var(--flip));
  filter: blur(var(--blur));
}
</style>
