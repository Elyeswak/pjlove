<script setup>
import { computed } from 'vue'

const props = defineProps({
  mood: { type: String, default: 'neutral' }, // neutral | shy | happy | love
  pose: { type: String, default: 'stand' }, // stand | wave | pottery
})

const arms = computed(() => ({
  stand: { l: 6, r: -6 },
  wave: { l: 150, r: -6 },
  pottery: { l: null, r: -6 },
}[props.pose] ?? { l: 6, r: -6 }))

const lips = {
  neutral: 'M74 104 Q80 108 86 104',
  shy: 'M76 105 Q80 107.5 84 105',
  happy: 'M73 102 Q80 111 87 102 Z',
  love: 'M73 102 Q80 111 87 102 Z',
}

// short curly brunette bob
const ring = []
for (let a = 150; a <= 390; a += 20) {
  const r = (a * Math.PI) / 180
  ring.push([80 + 34 * Math.cos(r), 77 + 38 * Math.sin(r)])
}
const bangs = [[60, 54, 11], [73, 46, 12], [88, 46, 12], [101, 54, 11]]
const shine = 'M66 40 q6 -5 13 -3 M50 66 q1 -6 5 -9 M106 66 q-1 -6 -5 -9'

// lace hem scallops
const lace = Array.from({ length: 12 }, (_, i) => [38 + i * 7.6, 232 + Math.sin((i / 11) * Math.PI) * 6])

const heart = (x, y) => `M${x} ${y + 4.5} l-5 -5 a3 3 0 0 1 5 -3.8 a3 3 0 0 1 5 3.8 z`
</script>

<template>
  <svg class="character girl" viewBox="0 0 160 290" role="img" aria-label="Girl with a short curly brunette bob and a dark red dress">
    <!-- legs in black stockings + mary janes -->
    <rect x="70" y="224" width="8" height="50" rx="3" fill="var(--ink)" />
    <rect x="82" y="224" width="8" height="50" rx="3" fill="var(--ink)" />
    <ellipse cx="71" cy="277" rx="10" ry="5.5" fill="var(--blood)" stroke="var(--ink)" stroke-width="2.5" />
    <ellipse cx="89" cy="277" rx="10" ry="5.5" fill="var(--blood)" stroke="var(--ink)" stroke-width="2.5" />

    <!-- back hair -->
    <circle v-for="(c, i) in ring" :key="'r' + i" :cx="c[0]" :cy="c[1]" r="13" fill="var(--hair-her)" />

    <!-- neck + choker -->
    <rect x="75" y="108" width="10" height="28" fill="var(--skin-her)" stroke="var(--ink)" stroke-width="2.5" />
    <rect x="74" y="120" width="12" height="4.5" fill="var(--ink)" />
    <path d="M80 129 l-2.6 -2.6 a1.6 1.6 0 0 1 2.6 -2 a1.6 1.6 0 0 1 2.6 2 z" fill="var(--blood-soft)" />

    <!-- dress: lace hem, flared skirt, corset bodice -->
    <circle v-for="(l, i) in lace" :key="'l' + i" :cx="l[0]" :cy="l[1]" r="5" fill="var(--ink)" />
    <path d="M64 174 L96 174 Q114 192 128 228 Q80 242 32 228 Q46 192 64 174 Z" fill="var(--blood)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round" />
    <path d="M72 182 L56 232 M80 182 L80 236 M88 182 L104 232" stroke="rgba(0,0,0,0.28)" stroke-width="2" fill="none" />
    <path d="M63 133 Q80 126 97 133 L97 146 L63 146 Z" fill="var(--skin-her)" />
    <path d="M59 137 Q65 131 70 139 Q76 147 80 141 Q84 147 90 139 Q95 131 101 137 C109 147 108 161 97 168 L96 176 L64 176 L63 168 C52 161 51 147 59 137 Z" fill="var(--blood)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round" />
    <path d="M66 158 Q73 164 80 159 Q87 164 94 158" stroke="rgba(0,0,0,0.35)" stroke-width="2" fill="none" stroke-linecap="round" />
    <path d="M77 162 L83 167 M83 162 L77 167 M77 167 L83 172 M83 167 L77 172" stroke="var(--ink)" stroke-width="1.5" />
    <rect x="64" y="172" width="32" height="5" fill="var(--ink)" />

    <!-- arms: long black lace sleeves -->
    <g v-if="arms.l !== null" class="arm" :class="{ waving: pose === 'wave' }" :style="{ '--rot': arms.l + 'deg', transformOrigin: '63.5px 140px' }">
      <rect x="58" y="136" width="11" height="70" rx="5" fill="var(--sleeve)" stroke="var(--ink)" stroke-width="2" />
      <path d="M58 202 L69 202 L73 212 L54 212 Z" fill="var(--sleeve)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round" />
      <ellipse cx="63.5" cy="217" rx="5" ry="7" fill="var(--skin-her)" stroke="var(--ink)" stroke-width="2.5" />
    </g>
    <g v-if="arms.r !== null" class="arm" :style="{ '--rot': arms.r + 'deg', transformOrigin: '96.5px 140px' }">
      <rect x="91" y="136" width="11" height="70" rx="5" fill="var(--sleeve)" stroke="var(--ink)" stroke-width="2" />
      <path d="M91 202 L102 202 L106 212 L87 212 Z" fill="var(--sleeve)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round" />
      <ellipse cx="96.5" cy="217" rx="5" ry="7" fill="var(--skin-her)" stroke="var(--ink)" stroke-width="2.5" />
    </g>

    <!-- head -->
    <ellipse cx="80" cy="78" rx="29" ry="33" fill="var(--skin-her)" stroke="var(--ink)" stroke-width="3" />
    <circle v-for="(c, i) in bangs" :key="'b' + i" :cx="c[0]" :cy="c[1]" :r="c[2]" fill="var(--hair-her)" />
    <path :d="shine" stroke="var(--hair-shine-her)" stroke-width="2.5" fill="none" stroke-linecap="round" />

    <!-- little red rose in her hair -->
    <g transform="translate(106 46)">
      <path d="M-4 6 q-8 2 -9 -4 q6 -2 9 4z M4 6 q8 2 9 -4 q-6 -2 -9 4z" fill="#2c3b2a" />
      <circle r="7" fill="var(--blood-soft)" stroke="var(--ink)" stroke-width="2" />
      <path d="M-3.5 0 a3.5 3.5 0 1 1 3.5 3.5 a2 2 0 1 1 -2 -2" fill="none" stroke="var(--ink)" stroke-width="1.4" />
    </g>

    <!-- eyes -->
    <g v-if="mood === 'shy'" fill="none" stroke="var(--ink)" stroke-width="3" stroke-linecap="round">
      <path d="M57 84 q10 7 20 0 M57 85 l-4 3 M60 88 l-2 4" />
      <path d="M83 84 q10 7 20 0 M103 85 l4 3 M100 88 l2 4" />
    </g>
    <template v-else>
      <g class="eyes">
        <ellipse cx="67" cy="83" rx="8.5" ry="10" fill="#fff" />
        <ellipse cx="93" cy="83" rx="8.5" ry="10" fill="#fff" />
        <template v-if="mood === 'love'">
          <path :d="heart(66, 84)" fill="var(--blood-soft)" />
          <path :d="heart(92, 84)" fill="var(--blood-soft)" />
        </template>
        <template v-else>
          <circle cx="65.5" cy="84" r="6.5" fill="var(--iris)" />
          <circle cx="91.5" cy="84" r="6.5" fill="var(--iris)" />
          <circle cx="65.5" cy="84" r="3.2" fill="var(--ink)" />
          <circle cx="91.5" cy="84" r="3.2" fill="var(--ink)" />
          <circle cx="67.6" cy="81.2" r="2" fill="var(--paper)" />
          <circle cx="93.6" cy="81.2" r="2" fill="var(--paper)" />
        </template>
      </g>
      <!-- lash lines -->
      <g fill="none" stroke="var(--ink)" stroke-width="2.6" stroke-linecap="round">
        <path d="M58 80 Q67 69 76.5 79" stroke-width="3.6" /><path d="M58.5 79 l-5 -2 M59.5 76 l-4 -4 M62 73 l-2 -4" />
        <path d="M83.5 79 Q93 69 102 80" stroke-width="3.6" /><path d="M101.5 79 l5 -2 M100.5 76 l4 -4 M98 73 l2 -4" />
      </g>
    </template>
    <path d="M58 61 q10 -6 19 -1 M83 60 q10 -5 19 1" stroke="var(--hair-her)" stroke-width="2.5" fill="none" stroke-linecap="round" />

    <!-- nose, rosy cheeks, dark red lips -->
    <path d="M80 89 q-2 5 1 6" stroke="var(--ink)" stroke-width="1.8" fill="none" stroke-linecap="round" />
    <ellipse cx="58" cy="98" rx="6.5" ry="3.5" fill="var(--blush)" :opacity="mood === 'neutral' ? 0.5 : 0.85" />
    <ellipse cx="102" cy="98" rx="6.5" ry="3.5" fill="var(--blush)" :opacity="mood === 'neutral' ? 0.5 : 0.85" />
    <path :d="lips[mood] || lips.neutral" :fill="mood === 'happy' || mood === 'love' ? 'var(--blood)' : 'none'" stroke="var(--blood)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
