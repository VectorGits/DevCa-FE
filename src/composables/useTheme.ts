import { computed, ref } from 'vue'

/**
 * Single source of truth for the theme. The initial value is whatever the
 * pre-paint script in index.html put on <html>, so there is no flash and no
 * second guess at the user's preference.
 */
const STORAGE_KEY = 'devca-theme'

const isDark = ref(
  typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
)

function apply(next: boolean) {
  isDark.value = next
  document.documentElement.classList.toggle('dark', next)
  try {
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
  } catch {
    /* private mode / storage disabled - theme still works for this page view */
  }
}

export function useTheme() {
  return {
    isDark: computed(() => isDark.value),
    toggleTheme: () => apply(!isDark.value),
    setTheme: apply,
  }
}
