<template>
  <nav class="nav">
    <RouterLink to="/" class="nav-link">Us <span class="h">♥</span></RouterLink>
    <RouterLink to="/movies" class="nav-link">Movies 🎬</RouterLink>
  </nav>
</template>

<style scoped>
.nav {
  position: relative; z-index: 5;
  display: flex; justify-content: center; gap: 10px;
  padding: max(14px, env(safe-area-inset-top)) 16px 4px;
}
.nav-link {
  font-family: var(--display); font-weight: 600; font-size: 1.05rem;
  color: var(--paper); text-decoration: none;
  padding: 8px 18px; border-radius: 999px; border: 2px solid rgba(250, 247, 245, 0.25);
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
@media (hover: hover) { .nav-link:hover { border-color: var(--paper); transform: translateY(-2px); } }
.nav-link.router-link-exact-active { background: var(--paper); color: var(--ink); border-color: var(--paper); }
.h { color: var(--blood-soft); }
@media (max-height: 500px) and (orientation: landscape) { .nav { padding-top: max(6px, env(safe-area-inset-top)); } .nav-link { padding: 4px 14px; } }
@media (max-width: 520px) { .nav-link { font-size: 0.98rem; padding: 7px 16px; } }
</style>
