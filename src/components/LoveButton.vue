<script setup>
import { ref } from 'vue'

defineProps({ variant: { type: String, default: 'primary' } }) // primary | light
const emit = defineEmits(['click'])
const sparks = ref([])
let id = 0

function onClick(e) {
  const burst = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + Math.random() * 0.4
    const d = 38 + Math.random() * 26
    return { id: ++id, dx: Math.cos(a) * d, dy: Math.sin(a) * d }
  })
  sparks.value.push(...burst)
  setTimeout(() => { sparks.value = sparks.value.filter((s) => !burst.includes(s)) }, 800)
  emit('click', e)
}
</script>

<template>
  <button class="love-btn btn" :class="variant" type="button" @click="onClick">
    <span class="lb-inner">
      <svg class="lb-heart" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <slot />
    </span>
    <span v-for="s in sparks" :key="s.id" class="spark" :style="{ '--dx': s.dx + 'px', '--dy': s.dy + 'px' }" aria-hidden="true">♥</span>
  </button>
</template>

<style scoped>
.love-btn {
  position: relative;
  background: var(--blood);
  color: var(--paper);
  border-color: var(--ink);
  box-shadow: 4px 4px 0 var(--ink), 0 0 0 0 rgba(163, 24, 43, 0.5);
  animation: glow 2s ease-in-out infinite;
}
.love-btn.light { background: var(--paper); color: var(--blood); }
@media (hover: hover) {
  .love-btn:hover { background: var(--blood-soft); }
  .love-btn.light:hover { background: #fff; }
  }
.lb-inner { display: inline-flex; align-items: center; gap: 10px; }
.lb-heart { width: 22px; height: 22px; fill: currentColor; animation: beat 1.1s ease-in-out infinite; }
.love-btn:hover .lb-inner { animation: wobble 0.5s ease-in-out; }
.spark {
  position: absolute; left: 50%; top: 50%; pointer-events: none;
  color: var(--blood-soft); font-size: 18px; text-shadow: 0 0 2px var(--paper);
  animation: spark 0.8s ease-out forwards;
}
@keyframes beat { 0%, 100% { transform: scale(1); } 15% { transform: scale(1.25); } 30% { transform: scale(1); } 45% { transform: scale(1.18); } }
@keyframes wobble { 25% { transform: rotate(-4deg); } 75% { transform: rotate(4deg); } }
@keyframes glow {
  0%, 100% { box-shadow: 4px 4px 0 var(--ink), 0 0 0 0 rgba(163, 24, 43, 0.55); }
  60% { box-shadow: 4px 4px 0 var(--ink), 0 0 0 14px rgba(163, 24, 43, 0); }
}
@keyframes spark {
  from { transform: translate(-50%, -50%) scale(0.6); opacity: 1; }
  to { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.2); opacity: 0; }
}
</style>
