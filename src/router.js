import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import MoviesView from './views/MoviesView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/movies', name: 'movies', component: MoviesView, meta: { title: 'Our Movie Wishlist 🎬' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
