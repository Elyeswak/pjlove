<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { reducedMotion } from '../utils/motion'

const props = defineProps({
  text: { type: String, required: true },
  side: { type: String, default: 'left' }, // which character is speaking
})
const shown = ref('')
let timer

watch(() => props.text, (t) => {
  clearInterval(timer)
  const chars = [...t]
  if (reducedMotion) { shown.value = t; return }
  shown.value = ''
  let i = 0
  timer = setInterval(() => {
    shown.value += chars[i++]
    if (i >= chars.length) clearInterval(timer)
  }, 40)
}, { immediate: true })

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="bubble" :class="side" aria-live="polite">
    <p class="ghost" aria-hidden="true">{{ text }}</p>
    <p class="typed">{{ shown }}<span v-if="shown.length < text.length" class="caret">|</span></p>
  </div>
</template>

<style scoped>
.bubble {
  position: relative;
  display: grid;
  background: var(--ink);
  color: var(--paper);
  border-radius: 24px;
  padding: 14px 22px;
  font-family: var(--display);
  font-size: clamp(1.15rem, 3.6vw, 1.6rem);
  font-weight: 600;
  text-align: center;
  max-width: 520px;
  margin: 0 auto 8px;
  box-shadow: 5px 5px 0 var(--blood);
}
.bubble p { grid-area: 1 / 1; margin: 0; }
.ghost { visibility: hidden; }
.bubble::after {
  content: '';
  position: absolute;
  bottom: -16px;
  border: 10px solid transparent;
  border-top: 14px solid var(--ink);
}
.bubble.left::after { left: 22%; }
.bubble.right::after { right: 22%; }
@media (max-width: 520px) { .bubble { padding: 11px 16px; border-radius: 20px; box-shadow: 4px 4px 0 var(--blood); } }
@media (max-height: 500px) and (orientation: landscape) { .bubble { font-size: 1.05rem; padding: 8px 16px; margin-bottom: 4px; } }
.caret { animation: caret 0.7s steps(1) infinite; color: var(--blood-soft); }
@keyframes caret { 50% { opacity: 0; } }
</style>
