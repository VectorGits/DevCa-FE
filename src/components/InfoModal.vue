<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { isDark } = useTheme()

function close() {
  emit('update:modelValue', false)
  try {
    localStorage.setItem('devca-seen-theme-hint', 'true')
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="info-modal">
      <div
        v-if="modelValue"
        class="info-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-modal-title"
        @click.self="close"
      >
        <div :class="['info-card', { 'is-dark': isDark }]">
          <!-- Close button -->
          <button
            type="button"
            class="info-close"
            aria-label="Close dialog"
            @click="close"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <!-- Decorative sun/moon badge -->
          <div class="info-badge" aria-hidden="true">
            <span class="badge-icon sun-icon">☀️</span>
            <span class="badge-divider">/</span>
            <span class="badge-icon moon-icon">🌙</span>
          </div>

          <!-- Dialog content -->
          <h2 id="info-modal-title" class="info-title">
            Switch Themes
          </h2>

          <p class="info-message">
            Click the <strong class="highlight">Sun/Moon</strong> to switch themes
          </p>

          <!-- Action button -->
          <button type="button" class="info-btn" @click="close">
            Got it
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Overlay with full screen blur ───────────────────────────────────── */
.info-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(10, 8, 16, 0.45);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* ── Modal Card (Rounded rectangle, translucent close to opaque) ─────── */
.info-card {
  position: relative;
  max-width: 380px;
  width: 100%;
  padding: 36px 28px 28px;
  border-radius: 28px;
  text-align: center;
  background: linear-gradient(168deg, rgba(255, 255, 255, 0.94), rgba(244, 239, 255, 0.96));
  color: #14121c;
  border: 1px solid rgba(20, 18, 28, 0.08);
  box-shadow:
    0 24px 50px -12px rgba(100, 80, 160, 0.25),
    0 4px 16px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.info-card.is-dark {
  background: linear-gradient(168deg, rgba(34, 27, 54, 0.95), rgba(16, 13, 26, 0.97));
  color: #ffffff;
  border: 1px solid rgba(196, 174, 255, 0.22);
  box-shadow:
    0 24px 50px -12px rgba(0, 0, 0, 0.7),
    0 4px 16px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(196, 174, 255, 0.18);
}

/* ── Close button ────────────────────────────────────────────────────── */
.info-close {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  border: none;
  background: rgba(20, 18, 28, 0.06);
  color: inherit;
  opacity: 0.65;
  cursor: pointer;
  transition: opacity 180ms ease, background 180ms ease, transform 180ms ease;
}

.info-card.is-dark .info-close {
  background: rgba(255, 255, 255, 0.1);
}

.info-close:hover {
  opacity: 1;
  transform: scale(1.08);
  background: rgba(20, 18, 28, 0.12);
}

.info-card.is-dark .info-close:hover {
  background: rgba(255, 255, 255, 0.18);
}

/* ── Badge ───────────────────────────────────────────────────────────── */
.info-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 32px;
  line-height: 1;
  margin-bottom: 14px;
  padding: 8px 16px;
  border-radius: 9999px;
  background: rgba(189, 166, 249, 0.18);
}

.info-card.is-dark .info-badge {
  background: rgba(196, 174, 255, 0.12);
}

.badge-divider {
  font-size: 20px;
  opacity: 0.4;
}

/* ── Typography ──────────────────────────────────────────────────────── */
.info-title {
  font-family: 'Cloudy', var(--font-sans);
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 10px;
  color: inherit;
}

.info-message {
  font-size: 1.05rem;
  line-height: 1.5;
  margin: 0 0 24px;
  color: inherit;
  opacity: 0.9;
}

.highlight {
  font-weight: 700;
  color: #7868c2;
}

.info-card.is-dark .highlight {
  color: #c4aeff;
}

/* ── Action button ───────────────────────────────────────────────────── */
.info-btn {
  display: inline-block;
  width: 100%;
  padding: 12px 24px;
  border: none;
  border-radius: 9999px;
  font-family: 'Cloudy', var(--font-sans);
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #bda6f9, #8f8bd4);
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
  box-shadow: 0 4px 16px rgba(140, 120, 200, 0.35);
}

.info-card.is-dark .info-btn {
  background: linear-gradient(135deg, #7c68b5, #52426e);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.info-btn:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}

.info-btn:active {
  transform: scale(0.98);
}

/* ── Transitions ─────────────────────────────────────────────────────── */
.info-modal-enter-active,
.info-modal-leave-active {
  transition: opacity 280ms ease;
}

.info-modal-enter-active .info-card,
.info-modal-leave-active .info-card {
  transition:
    transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 280ms ease;
}

.info-modal-enter-from,
.info-modal-leave-to {
  opacity: 0;
}

.info-modal-enter-from .info-card {
  transform: scale(0.92) translateY(14px);
  opacity: 0;
}

.info-modal-leave-to .info-card {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}
</style>
