<script setup>
import { reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import CharacterGuy from './CharacterGuy.vue'
import CharacterGirl from './CharacterGirl.vue'
import { reducedMotion } from '../utils/motion'

const emit = defineEmits(['done'])

const cx = 250
const base = 128
const clay = reactive({ h: 26, bw: 50, nw: 44, lift: 0 })

const potPath = computed(() => {
  const { h, bw, nw } = clay
  const wb = bw * 0.78
  return `M${cx - wb} ${base}
    C${cx - bw - 8} ${base - h * 0.3} ${cx - bw} ${base - h * 0.62} ${cx - nw} ${base - h * 0.88}
    L${cx - nw - 6} ${base - h} L${cx + nw + 6} ${base - h} L${cx + nw} ${base - h * 0.88}
    C${cx + bw} ${base - h * 0.62} ${cx + bw + 8} ${base - h * 0.3} ${cx + wb} ${base} Z`
})
const handY = computed(() => base - clay.h * 0.42 + clay.lift)
const leftHand = computed(() => ({ x: cx - clay.bw - 8, y: handY.value }))
const rightHand = computed(() => ({ x: cx + clay.bw + 8, y: handY.value }))
const swirls = computed(() => [0.3, 0.55].map((t) => {
  const y = base - clay.h * t
  const w = clay.bw * 0.85
  return `M${cx - w} ${y} Q${cx} ${y + 7} ${cx + w} ${y}`
}))

let tl, bob
onMounted(() => {
  if (reducedMotion) {
    Object.assign(clay, { h: 112, bw: 54, nw: 20 })
    emit('done')
    return
  }
  tl = gsap.timeline({ delay: 0.8, onComplete: () => emit('done') })
    .to(clay, { h: 70, bw: 40, nw: 30, duration: 1.6, ease: 'power2.inOut' })
    .to(clay, { h: 112, bw: 54, nw: 20, duration: 2, ease: 'power2.inOut' })
  bob = gsap.to(clay, { lift: -7, duration: 0.45, yoyo: true, repeat: -1, ease: 'sine.inOut' })
})
onBeforeUnmount(() => { tl?.kill(); bob?.kill() })

const heart = 'M0 6 C-10 -2 -6 -10 0 -5 C6 -10 10 -2 0 6Z'
</script>

<template>
  <div class="pottery" role="img" aria-label="The two of us making a pot together on a pottery wheel">
    <div class="pot-guy"><CharacterGuy mood="happy" pose="pottery" /></div>
    <div class="pot-girl"><CharacterGirl mood="happy" pose="pottery" /></div>

    <svg class="table" viewBox="0 0 500 220">
      <!-- table -->
      <rect x="30" y="148" width="440" height="80" rx="12" fill="var(--ink)" />
      <rect x="30" y="160" width="440" height="7" fill="var(--blood)" />

      <!-- wheel -->
      <rect x="205" y="128" width="90" height="24" fill="var(--blood)" stroke="var(--ink)" stroke-width="3" />
      <ellipse cx="250" cy="128" rx="80" ry="13" fill="var(--paper)" stroke="var(--ink)" stroke-width="3" />
      <ellipse class="spin" cx="250" cy="128" rx="62" ry="8.5" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-dasharray="9 14" />

      <!-- clay pot -->
      <path :d="potPath" fill="var(--clay)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round" />
      <path v-for="(d, i) in swirls" :key="i" class="spin" :d="d" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="6 9" opacity="0.35" />

      <!-- his arm (coat sleeve) -->
      <line x1="114" y1="44" :x2="leftHand.x - 8" :y2="leftHand.y" stroke="var(--ink)" stroke-width="18" stroke-linecap="round" />
      <line x1="114" y1="44" :x2="leftHand.x - 8" :y2="leftHand.y" stroke="var(--coat)" stroke-width="13" stroke-linecap="round" />
      <ellipse :cx="leftHand.x" :cy="leftHand.y" rx="7" ry="10" fill="var(--skin-him)" stroke="var(--ink)" stroke-width="3" />

      <!-- her arm (black sleeve) -->
      <line x1="390" y1="79" :x2="rightHand.x + 8" :y2="rightHand.y" stroke="var(--ink)" stroke-width="16" stroke-linecap="round" />
      <line x1="390" y1="79" :x2="rightHand.x + 8" :y2="rightHand.y" stroke="var(--sleeve)" stroke-width="11" stroke-linecap="round" />
      <ellipse :cx="rightHand.x" :cy="rightHand.y" rx="6" ry="9" fill="var(--skin-her)" stroke="var(--ink)" stroke-width="3" />

      <!-- hearts rising from the pot -->
      <g :transform="`translate(${cx} ${base - clay.h - 8})`">
        <path v-for="i in 4" :key="i" class="pot-heart" :d="heart" fill="var(--blood-soft)" :style="{ animationDelay: (i - 1) * 0.6 + 's', '--x': ((i % 2 ? -1 : 1) * (8 + i * 6)) + 'px' }" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.pottery { position: relative; width: 100%; max-width: 520px; aspect-ratio: 500 / 340; margin: 0 auto; }
.pot-guy, .pot-girl { position: absolute; bottom: 0; width: 30%; }
.pot-guy { left: 4%; }
.pot-girl { right: 4%; }
.table { position: absolute; left: 0; bottom: 0; width: 100%; height: auto; overflow: visible; }
.spin { animation: spin 0.6s linear infinite; }
@keyframes spin { to { stroke-dashoffset: -23; } }
.pot-heart { transform-box: fill-box; transform-origin: center; animation: float-up 2.4s ease-out infinite; opacity: 0; }
@keyframes float-up {
  0% { transform: translate(0, 0) scale(0.4); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translate(var(--x), -90px) scale(1.4); opacity: 0; }
}
</style>
