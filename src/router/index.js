import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ContactPage from '../views/ContactPage.vue'
import PhotoPage from '../views/PhotoPage.vue'
import MoviePage from '../views/MoviePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/contact', name: 'contact', component: ContactPage },
    { path: '/photo', name: 'photo', component: PhotoPage },
    { path: '/movie', name: 'movie', component: MoviePage },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
