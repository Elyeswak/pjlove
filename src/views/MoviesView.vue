<script setup>
import { ref, computed, onMounted } from 'vue'
import gsap from 'gsap'
import CharacterGuy from '../components/CharacterGuy.vue'
import CharacterGirl from '../components/CharacterGirl.vue'
import LoveButton from '../components/LoveButton.vue'
import { useStored } from '../composables/useStored'
import { reducedMotion } from '../utils/motion'

const starter = [
  { id: 1, title: 'About Time', note: 'bring tissues 🥲', watched: false },
  { id: 2, title: 'La La Land', note: 'sing along 🎶', watched: false },
  { id: 3, title: 'Before Sunrise', note: 'then talk all night', watched: false },
  { id: 4, title: 'Spirited Away', note: 'cozy blanket required', watched: false },
  { id: 5, title: 'Pride & Prejudice (2005)', note: 'the hand flex scene', watched: false },
]
const movies = useStored('movieWishlist', starter)
const tab = ref('todo')
const title = ref('')
const note = ref('')

const toWatch = computed(() => movies.value.filter((m) => !m.watched))
const watched = computed(() => movies.value.filter((m) => m.watched))
const shown = computed(() => (tab.value === 'todo' ? toWatch.value : watched.value))

function add() {
  const t = title.value.trim()
  if (!t) return
  movies.value.unshift({ id: Date.now(), title: t, note: note.value.trim(), watched: false })
  title.value = ''
  note.value = ''
  tab.value = 'todo'
}
const toggle = (m) => { m.watched = !m.watched }
const remove = (m) => { movies.value = movies.value.filter((x) => x.id !== m.id) }

onMounted(() => {
  if (reducedMotion) return
  gsap.from('.ticket', { y: 24, opacity: 0, duration: 0.5, stagger: 0.07, ease: 'back.out(1.6)' })
  gsap.from('.couch-scene .peek', { y: 40, duration: 0.8, stagger: 0.15, ease: 'back.out(2)' })
})
</script>

<template>
  <section class="movies">
    <header class="card head">
      <div class="couch-scene" aria-hidden="true">
        <div class="peek guy"><CharacterGuy mood="happy" /></div>
        <div class="peek girl"><CharacterGirl mood="happy" /></div>
        <svg class="couch" viewBox="0 0 260 90">
          <rect x="18" y="8" width="224" height="52" rx="22" fill="var(--blood)" stroke="var(--ink)" stroke-width="3" />
          <rect x="10" y="46" width="240" height="34" rx="14" fill="var(--blood-soft)" stroke="var(--ink)" stroke-width="3" />
          <rect x="2" y="30" width="34" height="54" rx="14" fill="var(--blood)" stroke="var(--ink)" stroke-width="3" />
          <rect x="224" y="30" width="34" height="54" rx="14" fill="var(--blood)" stroke="var(--ink)" stroke-width="3" />
          <text x="130" y="72" text-anchor="middle" font-size="16" fill="var(--paper)">🍿 ♥ 🍿</text>
        </svg>
      </div>
      <h1>Our Movie <span>Wishlist&nbsp;<span aria-hidden="true">🎬</span></span></h1>
      <p class="lead">Movie nights with you are my favorite nights.</p>

      <form class="add" @submit.prevent="add">
        <input v-model="title" class="field" placeholder="Movie title…" aria-label="Movie title" maxlength="80" required />
        <input v-model="note" class="field" placeholder="Little note (optional)" aria-label="Note" maxlength="80" />
        <LoveButton type="submit">Add</LoveButton>
      </form>
    </header>

    <div class="tabs" role="tablist">
      <button role="tab" :aria-selected="tab === 'todo'" :class="{ on: tab === 'todo' }" @click="tab = 'todo'">To watch ({{ toWatch.length }})</button>
      <button role="tab" :aria-selected="tab === 'done'" :class="{ on: tab === 'done' }" @click="tab = 'done'">Watched ({{ watched.length }})</button>
    </div>

    <TransitionGroup tag="ul" name="list" class="list">
      <li v-for="m in shown" :key="m.id" class="ticket" :class="{ watched: m.watched }">
        <div class="stub" aria-hidden="true">🎟️</div>
        <div class="info">
          <h3>{{ m.title }}</h3>
          <p v-if="m.note">{{ m.note }}</p>
          <span v-if="m.watched" class="stamp">WATCHED ♥</span>
        </div>
        <div class="ops">
          <button class="op watch" :aria-label="m.watched ? 'Mark as not watched' : 'Mark as watched'" @click="toggle(m)">{{ m.watched ? '↺' : '✓' }}</button>
          <button class="op del" aria-label="Remove movie" @click="remove(m)">✕</button>
        </div>
      </li>
    </TransitionGroup>
    <p v-if="!shown.length" class="empty">
      {{ tab === 'todo' ? 'Nothing left to watch… add more movies! 🍿' : 'No movies watched yet. Movie night soon? 🥺' }}
    </p>
  </section>
</template>

<style scoped>
.movies { padding-top: 12px; }
.head { text-align: center; padding-top: 8px; }
.head h1 { font-size: clamp(1.8rem, 6vw, 2.6rem); }
.lead { color: var(--muted); font-weight: 600; margin: 6px 0 18px; }

.couch-scene { position: relative; width: 260px; max-width: 100%; height: 178px; margin: 0 auto 6px; }
.peek { position: absolute; bottom: 0; }
.peek.guy { left: 52px; width: 82px; bottom: 12px; }
.peek.girl { right: 56px; width: 76px; bottom: 24px; }
.couch { position: absolute; left: 0; bottom: 0; width: 100%; height: auto; z-index: 1; }

.add { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
.field {
  flex: 1 1 180px; min-width: 0;
  font: inherit; font-weight: 600; font-size: 1rem;
  padding: 12px 18px; min-height: 52px;
  border: 3px solid var(--ink); border-radius: 999px; background: #fff; color: var(--ink);
}
.field::placeholder { color: #9a8f91; }

.tabs { display: flex; justify-content: center; gap: 8px; margin: 28px 0 14px; }
.tabs button {
  font-family: var(--display); font-size: 1rem; font-weight: 600; cursor: pointer;
  padding: 8px 18px; border-radius: 999px; border: 2px solid rgba(250, 247, 245, 0.3);
  background: transparent; color: var(--paper);
}
.tabs button.on { background: var(--blood); border-color: var(--blood); }

.list { list-style: none; padding: 0; margin: 0; display: grid; gap: 14px; position: relative; }
.ticket {
  position: relative;
  display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 14px;
  background: var(--paper); color: var(--ink);
  border-radius: 16px; padding: 14px 18px 14px 14px;
  border-left: 10px solid var(--blood);
  box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.6);
}
/* ticket notches */
.ticket::before, .ticket::after {
  content: ''; position: absolute; top: 50%; width: 22px; height: 22px; border-radius: 50%;
  background: var(--ink); translate: 0 -50%;
}
.ticket::before { left: -16px; }
.ticket::after { right: -11px; }
.stub { font-size: 1.6rem; padding-right: 12px; border-right: 2px dashed #c9bfc1; }
.info { min-width: 0; }
.info h3 { font-size: 1.15rem; overflow-wrap: anywhere; }
.info p { margin: 2px 0 0; color: var(--muted); font-size: 0.95rem; }
.ticket.watched .info h3, .ticket.watched .info p { opacity: 0.55; }
.ops { display: flex; gap: 8px; }
.op {
  width: 42px; height: 42px; border-radius: 50%; cursor: pointer; font-size: 1.1rem; font-weight: 800;
  border: 2.5px solid var(--ink); background: #fff; color: var(--ink);
  transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), background 0.2s;
}
.op { touch-action: manipulation; }
.op:active { transform: scale(0.9); }
@media (hover: hover) {
  .op:hover { transform: scale(1.12); }
  .op.watch:hover { background: var(--blood); color: var(--paper); }
  .op.del:hover { background: var(--ink); color: var(--paper); }
}
.stamp {
  position: absolute; right: 110px; top: 50%; translate: 0 -50%; rotate: -12deg;
  font-family: var(--display); font-weight: 700; font-size: 0.95rem; letter-spacing: 1px;
  color: var(--blood-soft); border: 3px solid var(--blood-soft); border-radius: 8px; padding: 2px 8px;
  opacity: 0.85; pointer-events: none;
  animation: stamp 0.35s cubic-bezier(.34,1.56,.64,1);
}
@keyframes stamp { from { scale: 2.2; opacity: 0; } }

.empty { text-align: center; opacity: 0.75; font-weight: 600; margin-top: 18px; }

.list-enter-active, .list-leave-active { transition: all 0.4s cubic-bezier(.34,1.56,.64,1); }
.list-enter-from { opacity: 0; transform: translateX(-30px) scale(0.9); }
.list-leave-to { opacity: 0; transform: translateX(40px) rotate(4deg); }
.list-leave-active { position: absolute; width: 100%; }
.list-move { transition: transform 0.4s ease; }

@media (max-width: 520px) {
  .head h1 { font-size: 1.7rem; }
  .head h1 span { white-space: nowrap; }
  .lead { font-size: 0.95rem; margin-bottom: 14px; }
  .couch-scene { transform: scale(0.88); transform-origin: bottom center; height: 160px; margin-top: -8px; }
  .add .field { flex-basis: 100%; }
  .add > :last-child { flex: 1 1 100%; justify-content: center; }
  .tabs { margin: 22px 0 12px; }
  .tabs button { font-size: 0.95rem; padding: 8px 14px; }
  .ticket { gap: 10px; padding: 12px 12px 12px 10px; border-left-width: 8px; }
  .stub { font-size: 1.3rem; padding-right: 8px; }
  .info h3 { font-size: 1.05rem; }
  .info p { font-size: 0.9rem; }
  .ops { gap: 6px; }
  .op { width: 40px; height: 40px; }
  /* stamp sits under the title instead of covering it */
  .stamp { position: static; display: inline-block; translate: none; rotate: -4deg; margin-top: 6px; font-size: 0.75rem; padding: 1px 6px; }
}
</style>
