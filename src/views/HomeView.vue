<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import CharacterGuy from '../components/CharacterGuy.vue'
import CharacterGirl from '../components/CharacterGirl.vue'
import SpeechBubble from '../components/SpeechBubble.vue'
import LoveButton from '../components/LoveButton.vue'
import PotteryScene from '../components/PotteryScene.vue'
import { useStored } from '../composables/useStored'
import { heartBurst, nextSunday, reducedMotion } from '../utils/motion'

const state = useStored('dateInvite', { step: 'ask', final: false })
const step = computed(() => state.value.step)
const sunday = nextSunday()

/* ---------- the runaway "No" button ---------- */
const noLabels = [
  'No', 'Are you sure?', 'Really sure?? 🥺', 'Pretty please?', 'Think again!',
  "You're breaking my heart 💔", "I'll be very sad…", 'Last chance!', 'Okay fine… Yes 💕',
]
const noCount = ref(0)
const noPos = ref(null)
const noBtn = ref(null)
const guySad = ref(false)
let sadTimer

const giveUp = computed(() => noCount.value >= noLabels.length - 1)
const noLabel = computed(() => noLabels[Math.min(noCount.value, noLabels.length - 1)])
// keep the growing Yes button inside the card on small phones
const maxYes = window.innerWidth < 420 ? 1.55 : window.innerWidth < 640 ? 1.8 : 2.1
const yesScale = computed(() => Math.min(1 + noCount.value * 0.14, maxYes))
const noStyle = computed(() => {
  const scale = giveUp.value ? 1 : Math.max(1 - noCount.value * 0.07, 0.55)
  return noPos.value
    ? { left: noPos.value.x + 'px', top: noPos.value.y + 'px', transform: `scale(${scale})` }
    : { transform: `scale(${scale})` }
})

function dodge() {
  if (giveUp.value) return
  noCount.value++
  navigator.vibrate?.(30) // tiny buzz on Android phones
  guySad.value = true
  clearTimeout(sadTimer)
  sadTimer = setTimeout(() => (guySad.value = false), 1000)
  const el = noBtn.value
  const w = el?.offsetWidth ?? 140
  const h = el?.offsetHeight ?? 52
  noPos.value = {
    x: 12 + Math.random() * Math.max(0, window.innerWidth - w - 24),
    y: 72 + Math.random() * Math.max(0, window.innerHeight - h - 100),
  }
}
function onNoHover(e) { if (e.pointerType === 'mouse') dodge() }
function onNoTouch(e) {
  e.preventDefault() // stop the tap from becoming a click
  giveUp.value ? sayYes() : dodge()
}
function onNoClick() { giveUp.value ? sayYes() : dodge() }

/* ---------- story flow ---------- */
function sayYes() {
  noCount.value = 0
  noPos.value = null
  if (step.value === 'ask') {
    heartBurst()
    state.value.step = 'sunday'
  } else if (step.value === 'sunday') {
    heartBurst(true)
    state.value.step = 'pottery'
  }
}

function loveYouToo() {
  heartBurst(true)
  state.value.final = true
}

function replay() {
  noCount.value = 0
  noPos.value = null
  state.value = { step: 'ask', final: false }
}

const bubble = computed(() => {
  switch (step.value) {
    case 'ask': return guySad.value ? 'Nooo… please? 🥺' : 'Will you go out on a date with me? 🥺'
    case 'sunday': return guySad.value ? "Aww, c'mon… 🥺" : `Yaaay!! 🥰 So… this Sunday, ${sunday}?`
    case 'love': return state.value.final ? 'See you Sunday, my love ♥' : 'And one more thing… I love you ❤️'
    default: return ''
  }
})

const guy = computed(() => {
  if (step.value === 'ask') return { mood: guySad.value ? 'sad' : 'nervous', pose: 'ask', flower: true }
  if (step.value === 'sunday') return { mood: guySad.value ? 'sad' : 'happy', pose: 'stand' }
  return { mood: 'love', pose: state.value.final ? 'wave' : 'stand' }
})
const girl = computed(() => {
  if (step.value === 'ask') return { mood: 'shy', pose: 'stand' }
  if (step.value === 'sunday') return { mood: 'happy', pose: 'wave' }
  return { mood: state.value.final ? 'love' : 'shy', pose: state.value.final ? 'wave' : 'stand' }
})

/* ---------- animations ---------- */
const guyWrap = ref(null)
const girlWrap = ref(null)
const revealTitle = ref(null)
const showNext = ref(false)
let nextTimer

watch(step, async (s) => {
  await nextTick()
  showNext.value = false
  clearTimeout(nextTimer)
  if (reducedMotion) { showNext.value = true; return }
  if (s === 'ask' && guyWrap.value) {
    gsap.fromTo(guyWrap.value, { x: -180, opacity: 0 }, { x: 0, opacity: 1, duration: 1.1, ease: 'back.out(1.4)' })
    gsap.fromTo(girlWrap.value, { x: 180, opacity: 0 }, { x: 0, opacity: 1, duration: 1.1, delay: 0.2, ease: 'back.out(1.4)' })
  } else if (s === 'sunday' && guyWrap.value) {
    gsap.fromTo([guyWrap.value, girlWrap.value], { y: 0 }, { y: -26, duration: 0.25, yoyo: true, repeat: 3, ease: 'power1.out', stagger: 0.1 })
  } else if (s === 'pottery' && revealTitle.value) {
    gsap.fromTo(revealTitle.value, { rotationX: -100, scale: 0.6, opacity: 0 }, { rotationX: 0, scale: 1, opacity: 1, duration: 1.1, delay: 0.5, ease: 'back.out(1.8)' })
    nextTimer = setTimeout(() => (showNext.value = true), 6000) // fallback
  } else if (s === 'love' && guyWrap.value) {
    gsap.fromTo([guyWrap.value, girlWrap.value], { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.15 })
  }
}, { immediate: true })

onBeforeUnmount(() => { clearTimeout(sadTimer); clearTimeout(nextTimer) })
</script>

<template>
  <section class="home">
    <div class="card scene">
      <!-- Pottery reveal -->
      <template v-if="step === 'pottery'">
        <div class="reveal">
          <p class="kicker">I'm inviting you on a…</p>
          <h1 ref="revealTitle" class="reveal-title">🏺 Pottery Date 🏺</h1>
          <p class="sub">This Sunday, {{ sunday }} · just you, me &amp; a lot of clay</p>
        </div>
        <PotteryScene @done="showNext = true" />
        <div class="actions">
          <Transition name="fade">
            <LoveButton v-if="showNext" @click="state.step = 'love'">Aww, I'm so in</LoveButton>
          </Transition>
        </div>
      </template>

      <!-- Talking scenes -->
      <template v-else>
        <SpeechBubble :text="bubble" side="left" />

        <div class="stage" :class="{ love: step === 'love' }">
          <svg v-if="step === 'love'" class="big-heart" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <div ref="guyWrap" class="char guy-wrap">
            <div class="lean"><CharacterGuy v-bind="guy" /></div>
          </div>
          <div v-if="step === 'love'" class="between" aria-hidden="true">
            <span v-for="i in 5" :key="i" :style="{ animationDelay: i * 0.45 + 's' }">♥</span>
          </div>
          <div ref="girlWrap" class="char girl-wrap">
            <div class="lean"><CharacterGirl v-bind="girl" /></div>
          </div>
        </div>

        <!-- Yes / No -->
        <div v-if="step === 'ask' || step === 'sunday'" :key="step" class="actions">
          <LoveButton :style="{ transform: `scale(${yesScale})` }" class="yes" @click="sayYes">Yes!</LoveButton>
          <Teleport to="body" :disabled="!noPos">
            <button
              ref="noBtn" type="button" class="btn no" :class="{ floating: noPos, giveup: giveUp }" :style="noStyle"
              @pointerenter="onNoHover" @touchstart="onNoTouch" @click="onNoClick"
            >{{ noLabel }}</button>
          </Teleport>
        </div>

        <!-- I love you -->
        <div v-else-if="step === 'love'" class="actions column">
          <Transition name="fade" mode="out-in">
            <LoveButton v-if="!state.final" class="big" @click="loveYouToo">I love you too</LoveButton>
            <div v-else class="final">
              <p class="final-text">Forever my favorite person. 💌</p>
              <RouterLink to="/movies" class="btn movies-link">Our movie wishlist →</RouterLink>
            </div>
          </Transition>
        </div>
      </template>
    </div>

    <p class="footer">
      made with ♥ just for you
      <button v-if="step !== 'ask'" class="link-btn" type="button" @click="replay">↺ replay</button>
    </p>
  </section>
</template>

<style scoped>
.home { padding-top: 12px; }
.scene { overflow: hidden; }

.stage {
  position: relative;
  display: flex; justify-content: center; align-items: flex-end;
  gap: clamp(6px, 5vw, 56px);
  padding-top: 18px;
}
/* sized by width AND height so both always fit on one phone screen */
.char { width: min(172px, 34vw, 22vh); width: min(172px, 34vw, 22dvh, 60vw); position: relative; z-index: 1; }
.girl-wrap { width: min(156px, 31vw, 20vh); width: min(156px, 31vw, 20dvh); }
.lean { transition: transform 0.9s cubic-bezier(.34,1.56,.64,1); transform-origin: bottom center; }
.stage.love .guy-wrap .lean { transform: rotate(6deg) translateX(10px); }
.stage.love .girl-wrap .lean { transform: rotate(-7deg) translateX(-10px); }

.big-heart {
  position: absolute; left: 50%; bottom: 8%;
  width: min(92%, 440px); translate: -50% 0;
  fill: var(--blood); opacity: 0.14;
  animation: pulse 1.4s ease-in-out infinite;
}
@keyframes pulse { 0%, 100% { scale: 1; } 15% { scale: 1.06; } 30% { scale: 1; } 45% { scale: 1.04; } }

.between { position: absolute; left: 50%; top: 30%; z-index: 2; }
.between span {
  position: absolute; color: var(--blood-soft); font-size: 22px; opacity: 0;
  animation: pop 2.3s ease-out infinite;
}
@keyframes pop {
  0% { transform: translate(-50%, 20px) scale(0.3); opacity: 0; }
  25% { opacity: 1; }
  100% { transform: translate(-50%, -70px) scale(1.3); opacity: 0; }
}

.actions {
  display: flex; justify-content: center; align-items: center; flex-wrap: wrap;
  gap: 28px; margin-top: 22px; min-height: 76px;
}
.actions.column { flex-direction: column; }
.yes { transform-origin: center; transition: transform 0.35s cubic-bezier(.34,1.56,.64,1); z-index: 2; }
.no { background: var(--paper); color: var(--ink); white-space: nowrap; }
.no.floating { position: fixed; z-index: 100; transition: left 0.25s ease, top 0.25s ease, transform 0.25s; }
.no.giveup { background: var(--blood-soft); color: var(--paper); }
.big { font-size: 1.35rem; padding: 16px 34px; }

.final { text-align: center; display: grid; gap: 14px; justify-items: center; }
.final-text { font-family: var(--display); font-size: 1.3rem; margin: 0; color: var(--blood); }
.movies-link { text-decoration: none; display: inline-flex; align-items: center; background: var(--ink); color: var(--paper); box-shadow: 4px 4px 0 var(--blood); }
.movies-link:hover { transform: translateY(-2px); }

.reveal { text-align: center; perspective: 600px; margin-bottom: 8px; }
.kicker { font-family: var(--display); font-size: clamp(1.1rem, 3.5vw, 1.4rem); margin: 0 0 6px; color: var(--muted); }
.reveal-title {
  display: inline-block;
  max-width: 100%;
  font-size: clamp(1.5rem, 7.2vw, 3.4rem);
  color: var(--paper); background: var(--blood);
  padding: 8px 22px; border-radius: 18px; border: 3px solid var(--ink);
  box-shadow: 6px 6px 0 var(--ink);
  transform-origin: top center;
}
.sub { margin: 12px 0 0; font-weight: 600; color: var(--muted); }

.footer { text-align: center; margin-top: 26px; opacity: 0.75; font-size: 0.95rem; display: flex; gap: 14px; justify-content: center; align-items: center; }

@media (max-width: 520px) {
  .stage { padding-top: 12px; }
  .actions { gap: 16px; margin-top: 18px; min-height: 64px; }
  .big { font-size: 1.2rem; padding: 14px 28px; }
  .reveal-title { padding: 6px 14px; border-radius: 14px; box-shadow: 4px 4px 0 var(--ink); }
  .sub { font-size: 0.92rem; margin-top: 10px; }
  .final-text { font-size: 1.15rem; }
  .footer { margin-top: 20px; font-size: 0.9rem; }
}
/* landscape phones: tighten vertical spacing */
@media (max-height: 500px) and (orientation: landscape) {
  .stage { padding-top: 6px; }
  .char { width: 19dvh; }
  .girl-wrap { width: 17dvh; }
  .actions { margin-top: 10px; min-height: 56px; }
}
</style>
