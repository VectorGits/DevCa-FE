import { ref, readonly, computed, onMounted, onBeforeUnmount } from 'vue'

/* ── Shared input state (normalised –1 … +1 from viewport centre) ────── */
const inputX = ref(0)
const inputY = ref(0)

/* ── Gyroscope / motion permission state ─────────────────────────────── */
const isTouchDevice = ref(false)
const gyroNeedsPrompt = ref(false)
const gyroPermission = ref<'unknown' | 'prompt' | 'granted' | 'denied'>('unknown')

let initialized = false

/* ── Event handlers ──────────────────────────────────────────────────── */
function onMouseMove(e: MouseEvent) {
  inputX.value = (e.clientX / window.innerWidth - 0.5) * 2   // –1 … +1
  inputY.value = (e.clientY / window.innerHeight - 0.5) * 2  // –1 … +1
}

function onDeviceOrientation(e: DeviceOrientationEvent) {
  const gamma = e.gamma ?? 0  // left-right tilt  (–90 … 90)
  const beta = e.beta ?? 0    // front-back tilt  (–180 … 180)
  // Normalise to –1 … +1.  ±30° maps to ±1; 45° is the neutral holding angle.
  inputX.value = Math.max(-1, Math.min(1, gamma / 30))
  inputY.value = Math.max(-1, Math.min(1, (beta - 45) / 30))
}

function startGyroListening() {
  window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true })
}

/* ── Initialise once (called on first component mount) ───────────────── */
function init() {
  if (initialized) return
  initialized = true

  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  if (isTouchDevice.value) {
    if (!('DeviceOrientationEvent' in window)) {
      gyroPermission.value = 'denied'
      return
    }

    const DOE = DeviceOrientationEvent as any
    if (typeof DOE.requestPermission === 'function') {
      // iOS 13+ — must be triggered from a user gesture
      gyroPermission.value = 'prompt'
      setTimeout(() => {
        gyroNeedsPrompt.value = true
      }, 1400)
    } else {
      // Android / other — no permission needed, just listen
      gyroPermission.value = 'granted'
      startGyroListening()
    }
  } else {
    // Desktop — use mouse
    window.addEventListener('mousemove', onMouseMove, { passive: true })
  }
}

/* ─── Per-component parallax hook ─────────────────────────────────────
 *
 * @param strength  Maximum displacement in px (default 18).
 * @param smoothing Lerp factor per frame — lower = smoother (default 0.08).
 */
export function useParallax(strength = 18, smoothing = 0.08) {
  const x = ref(0)
  const y = ref(0)
  let raf = 0

  function tick() {
    x.value += ((-inputX.value * strength) - x.value) * smoothing
    y.value += ((-inputY.value * strength) - y.value) * smoothing
    raf = requestAnimationFrame(tick)
  }

  onMounted(() => {
    init()
    raf = requestAnimationFrame(tick)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
  })

  return {
    /** Horizontal offset (px). Bind to transform / translate. */
    parallaxX: readonly(x),
    /** Vertical offset (px). Bind to transform / translate. */
    parallaxY: readonly(y),
  }
}

/* ─── Gyro permission UI hook (used by GyroPermission.vue) ───────────── */
export function useGyroPermission() {
  return {
    needsPrompt: computed(() => gyroNeedsPrompt.value),
    permission: computed(() => gyroPermission.value),
    isTouchDevice: computed(() => isTouchDevice.value),

    /** Call from a user-gesture handler (tap / click). */
    async grant() {
      try {
        const DOE = DeviceOrientationEvent as any
        const result = await DOE.requestPermission()
        if (result === 'granted') {
          gyroPermission.value = 'granted'
          gyroNeedsPrompt.value = false
          startGyroListening()
          return true
        }
      } catch {
        /* permission denied or not supported */
      }
      gyroPermission.value = 'denied'
      gyroNeedsPrompt.value = false
      return false
    },

    dismiss() {
      gyroNeedsPrompt.value = false
    },
  }
}
