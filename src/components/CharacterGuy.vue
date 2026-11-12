<script setup>
import { computed } from 'vue'

const props = defineProps({
  mood: { type: String, default: 'happy' }, // happy | nervous | sad | love
  pose: { type: String, default: 'stand' }, // stand | ask | wave | pottery
  flower: { type: Boolean, default: false },
})

// arm rotation in degrees; null hides the arm (drawn by the pottery scene instead)
const arms = computed(() => ({
  stand: { l: 6, r: -6 },
  ask: { l: 6, r: -72 },
  wave: { l: 6, r: -150 },
  pottery: { l: 6, r: null },
}[props.pose] ?? { l: 6, r: -6 }))

const mouths = {
  happy: 'M71 104 Q80 112 89 104',
  nervous: 'M71 107 q4.5 -3 9 0 t9 0',
  sad: 'M72 109 Q80 102 88 109',
  love: 'M70 102 Q80 116 90 102 Z',
}
const brows = {
  happy: 'M58 63 q9 -5 18 -1 M84 62 q9 -4 18 1',
  nervous: 'M58 61 q9 -2 18 3 M84 64 q9 -5 18 -3',
  sad: 'M58 66 L76 59 M84 59 L102 66',
  love: 'M58 60 q9 -7 18 -2 M84 58 q9 -5 18 2',
}

// wild brunette curls: [x, y, r]
const curls = [
  [52, 66, 10], [49, 52, 12], [55, 38, 13], [67, 27, 13], [81, 22, 14], [95, 25, 13], [106, 35, 13],
  [112, 49, 12], [110, 64, 10], [70, 14, 9], [88, 11, 10], [102, 18, 8], [60, 47, 11], [74, 41, 12],
  [90, 42, 11], [101, 50, 10],
]
const shine = 'M64 22 q6 -5 12 -3 M90 18 q5 -3 10 0 M52 44 q2 -6 7 -8'

const heart = (x, y) => `M${x} ${y + 4} l-4.6 -4.6 a2.7 2.7 0 0 1 4.6 -3.4 a2.7 2.7 0 0 1 4.6 3.4 z`
</script>

<template>
  <svg class="character guy" viewBox="0 0 160 330" role="img" aria-label="Tall slender guy with curly brunette hair, round glasses and a long black coat">
    <!-- long thin legs + pointy shoes -->
    <rect x="67" y="220" width="11" height="90" rx="4" fill="var(--ink)" />
    <rect x="82" y="220" width="11" height="90" rx="4" fill="var(--ink)" />
    <path d="M78 305 L54 313 Q46 318 54 321 L79 321 Z" fill="var(--ink)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round" />
    <path d="M82 305 L106 313 Q114 318 106 321 L81 321 Z" fill="var(--ink)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round" />
    <path d="M58 316 q6 -3 12 -3 M90 313 q6 0 12 3" stroke="#5a5054" stroke-width="1.5" fill="none" />

    <!-- long thin neck -->
    <rect x="75" y="108" width="10" height="34" fill="var(--skin)" stroke="var(--ink)" stroke-width="2.5" />

    <!-- tailcoat -->
    <path d="M56 136 Q80 127 104 136 L100 198 L114 256 L86 246 L80 212 L74 246 L46 256 L60 198 Z" fill="var(--coat)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round" />
    <path d="M69 133 L80 168 L91 133 Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round" />
    <path d="M69 133 L76 160 M91 133 L84 160" stroke="var(--ink)" stroke-width="2.5" fill="none" />
    <!-- dark red bow tie -->
    <path d="M80 141 L70 135 L70 147 Z M80 141 L90 135 L90 147 Z" fill="var(--blood)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round" />
    <circle cx="80" cy="141" r="2.8" fill="var(--blood-soft)" stroke="var(--ink)" stroke-width="1.5" />
    <circle cx="80" cy="182" r="2.4" fill="#8a7f83" />
    <circle cx="80" cy="196" r="2.4" fill="#8a7f83" />
    <path d="M64 150 q4 3 8 1" stroke="var(--blood-soft)" stroke-width="2" fill="none" />

    <!-- arms -->
    <g v-if="arms.l !== null" class="arm" :style="{ '--rot': arms.l + 'deg', transformOrigin: '59.5px 142px' }">
      <rect x="53" y="138" width="13" height="88" rx="6" fill="var(--coat)" stroke="var(--ink)" stroke-width="2.5" />
      <rect x="53" y="220" width="13" height="6" fill="var(--paper)" stroke="var(--ink)" stroke-width="2" />
      <ellipse cx="59.5" cy="232" rx="6" ry="8" fill="var(--skin)" stroke="var(--ink)" stroke-width="2.5" />
    </g>
    <g v-if="arms.r !== null" class="arm" :class="{ waving: pose === 'wave' }" :style="{ '--rot': arms.r + 'deg', transformOrigin: '100.5px 142px' }">
      <g v-if="flower">
        <path d="M100.5 236 q3 16 0 34" stroke="#2c3b2a" stroke-width="3" fill="none" stroke-linecap="round" />
        <path d="M100.5 252 q8 -2 9 6 q-8 1 -9 -6z" fill="#2c3b2a" />
        <circle cx="100.5" cy="276" r="9" fill="var(--blood)" stroke="var(--ink)" stroke-width="2" />
        <path d="M100.5 276 m-5 0 a5 5 0 1 1 5 5 a3 3 0 1 1 -3 -3" fill="none" stroke="var(--ink)" stroke-width="1.6" />
      </g>
      <rect x="94" y="138" width="13" height="88" rx="6" fill="var(--coat)" stroke="var(--ink)" stroke-width="2.5" />
      <rect x="94" y="220" width="13" height="6" fill="var(--paper)" stroke="var(--ink)" stroke-width="2" />
      <ellipse cx="100.5" cy="232" rx="6" ry="8" fill="var(--skin)" stroke="var(--ink)" stroke-width="2.5" />
    </g>

    <!-- head: long oval face -->
    <ellipse cx="50" cy="84" rx="5" ry="8" fill="var(--skin)" stroke="var(--ink)" stroke-width="2.5" />
    <ellipse cx="110" cy="84" rx="5" ry="8" fill="var(--skin)" stroke="var(--ink)" stroke-width="2.5" />
    <ellipse cx="80" cy="80" rx="30" ry="37" fill="var(--skin)" stroke="var(--ink)" stroke-width="3" />
    <circle v-for="(c, i) in curls" :key="i" :cx="c[0]" :cy="c[1]" :r="c[2]" fill="var(--hair-him)" />
    <path :d="shine" stroke="var(--hair-shine)" stroke-width="2.5" fill="none" stroke-linecap="round" />

    <!-- big eyes with tired little shadows -->
    <path d="M58 95 q9 5 18 0 M84 95 q9 5 18 0" stroke="var(--eye-shadow)" stroke-width="3" fill="none" stroke-linecap="round" />
    <g class="eyes">
      <circle cx="67" cy="82" r="10" fill="var(--paper)" stroke="var(--ink)" stroke-width="2" />
      <circle cx="93" cy="82" r="10" fill="var(--paper)" stroke="var(--ink)" stroke-width="2" />
      <template v-if="mood === 'love'">
        <path :d="heart(68, 82)" fill="var(--blood-soft)" />
        <path :d="heart(94, 82)" fill="var(--blood-soft)" />
      </template>
      <template v-else>
        <circle cx="69" cy="83" r="3.4" fill="var(--ink)" />
        <circle cx="95" cy="83" r="3.4" fill="var(--ink)" />
        <circle cx="70" cy="81.8" r="1.1" fill="var(--paper)" />
        <circle cx="96" cy="81.8" r="1.1" fill="var(--paper)" />
      </template>
    </g>
    <!-- droopy lids when sad -->
    <g v-if="mood === 'sad'" fill="var(--skin)" stroke="var(--ink)" stroke-width="2">
      <path d="M57 82 A10 10 0 0 1 77 82 Z" />
      <path d="M83 82 A10 10 0 0 1 103 82 Z" />
    </g>
    <path :d="brows[mood] || brows.happy" stroke="var(--hair-him)" stroke-width="3" fill="none" stroke-linecap="round" />

    <!-- round glasses -->
    <g fill="rgba(255,255,255,0.12)" stroke="var(--ink)" stroke-width="3">
      <circle cx="67" cy="82" r="12.5" />
      <circle cx="93" cy="82" r="12.5" />
    </g>
    <path d="M79 80 Q80 78 81 80" fill="none" stroke="var(--ink)" stroke-width="2.5" />
    <path d="M54.5 80 L48 78 M105.5 80 L112 78" stroke="var(--ink)" stroke-width="2.5" />

    <!-- nose, cheeks, mouth -->
    <path d="M80 89 q-3 7 1 9" stroke="var(--ink)" stroke-width="2" fill="none" stroke-linecap="round" />
    <ellipse cx="59" cy="99" rx="6" ry="3" fill="var(--blush)" :opacity="mood === 'love' ? 0.8 : 0.45" />
    <ellipse cx="101" cy="99" rx="6" ry="3" fill="var(--blush)" :opacity="mood === 'love' ? 0.8 : 0.45" />
    <path :d="mouths[mood] || mouths.happy" :fill="mood === 'love' ? 'var(--blood)' : 'none'" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

    <!-- nervous sweat -->
    <path v-if="mood === 'nervous'" d="M114 56 q6 10 0 13 q-6 -3 0 -13z" fill="#d6e4ee" stroke="var(--ink)" stroke-width="1.8" />
  </svg>
</template>
