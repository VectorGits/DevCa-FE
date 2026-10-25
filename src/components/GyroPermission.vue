<script setup lang="ts">
import { useGyroPermission } from '../composables/useParallax'
import { useTheme } from '../composables/useTheme'

const { needsPrompt, grant, dismiss } = useGyroPermission()
const { isDark } = useTheme()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="needsPrompt" class="gyro-overlay" @click.self="dismiss">
        <div :class="['gyro-card', { 'is-dark': isDark }]">
          <div class="gyro-deco">☁️</div>

          <h2 class="gyro-title">Enhance Your Experience</h2>

          <p class="gyro-body">
            Allow motion access to interact with the clouds and sky by tilting
            your device.
          </p>

          <div class="gyro-actions">
            <button class="gyro-allow" @click="grant">Allow Motion</button>
            <button class="gyro-skip" @click="dismiss">No thanks</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Overlay ─────────────────────────────────────────────────────────── */
.gyro-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 8, 16, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: 24px;
}

/* ── Card ─────────────────────────────────────────────────────────────── */
.gyro-card {
  position: relative;
  max-width: 340px;
  width: 100%;
  padding: 36px 28px 28px;
  border-radius: 24px;
  text-align: center;
  overflow: hidden;
  background: linear-gradient(168deg, rgba(255, 255, 255, 0.94), rgba(238, 232, 255, 0.96));
  box-shadow:
    0 12px 40px rgba(100, 80, 160, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.gyro-card.is-dark {
  background: linear-gradient(168deg, rgba(42, 33, 68, 0.95), rgba(15, 13, 24, 0.97));
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(196, 174, 255, 0.15);
}

/* ── Decorative cloud emoji ──────────────────────────────────────────── */
.gyro-deco {
  font-size: 52px;
  line-height: 1;
  margin-bottom: 14px;
  filter: drop-shadow(0 4px 12px rgba(140, 120, 200, 0.35));
  animation: gyro-float 3.2s ease-in-out infinite;
}

@keyframes gyro-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}

/* ── Typography ──────────────────────────────────────────────────────── */
.gyro-title {
  font-family: 'Cloudy', var(--font-sans);
  font-size: 1.3rem;
  font-weight: 700;
  color: #14121c;
  margin: 0 0 8px;
}

.gyro-card.is-dark .gyro-title {
  color: #fff;
}

.gyro-body {
  font-size: 0.88rem;
  line-height: 1.55;
  color: rgba(20, 18, 28, 0.65);
  margin: 0 0 26px;
}

.gyro-card.is-dark .gyro-body {
  color: rgba(255, 255, 255, 0.55);
}

/* ── Buttons ─────────────────────────────────────────────────────────── */
.gyro-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gyro-allow {
  padding: 13px 24px;
  border: none;
  border-radius: 14px;
  font-family: 'Cloudy', var(--font-sans);
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #bda6f9, #8f8bd4);
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease;
  box-shadow: 0 4px 16px rgba(140, 120, 200, 0.35);
}

.gyro-allow:active {
  transform: scale(0.97);
}

.gyro-skip {
  padding: 8px 16px;
  border: none;
  border-radius: 10px;
  background: transparent;
  font-family: inherit;
  font-size: 0.82rem;
  color: rgba(20, 18, 28, 0.45);
  cursor: pointer;
  transition: color 180ms ease;
}

.gyro-card.is-dark .gyro-skip {
  color: rgba(255, 255, 255, 0.35);
}

/* ── Modal transition ────────────────────────────────────────────────── */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 320ms ease;
}

.modal-enter-active .gyro-card,
.modal-leave-active .gyro-card {
  transition:
    transform 420ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 320ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .gyro-card {
  transform: scale(0.9) translateY(16px);
  opacity: 0;
}

.modal-leave-to .gyro-card {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
</style>
