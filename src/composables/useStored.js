import { ref, watch } from 'vue'

/** A ref persisted to localStorage; works (unsaved) when storage is unavailable. */
export function useStored(key, initial) {
  let value = initial
  try {
    const raw = localStorage.getItem(key)
    if (raw) value = JSON.parse(raw)
  } catch {}
  const state = ref(value)
  watch(state, (v) => {
    try { localStorage.setItem(key, JSON.stringify(v)) } catch {}
  }, { deep: true })
  return state
}
