<script setup>
const hearts = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: 10 + Math.random() * 22,
  duration: 10 + Math.random() * 14,
  delay: -Math.random() * 24,
  drift: (Math.random() - 0.5) * 80,
  opacity: 0.15 + Math.random() * 0.35,
  white: i % 5 === 0,
}))
</script>

<template>
  <div class="hearts" aria-hidden="true">
    <span
      v-for="h in hearts" :key="h.id" class="fh"
      :style="{ left: h.left + '%', fontSize: h.size + 'px', animationDuration: h.duration + 's', animationDelay: h.delay + 's', '--drift': h.drift + 'px', '--o': h.opacity, color: h.white ? 'var(--paper)' : 'var(--blood-soft)' }"
    >♥</span>
  </div>
</template>

<style scoped>
.hearts { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.fh { position: absolute; bottom: -40px; animation: rise linear infinite; opacity: 0; }
@keyframes rise {
  0% { transform: translate(0, 0) rotate(-10deg); opacity: 0; }
  10% { opacity: var(--o); }
  90% { opacity: var(--o); }
  100% { transform: translate(var(--drift), -110vh) rotate(15deg); opacity: 0; }
}
</style>
