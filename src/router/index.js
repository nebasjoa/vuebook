import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BlogView from '@/views/BlogView.vue'
import CvView from '@/views/CvView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: "Home", component: HomeView },
    { path: '/blog', name: "Blog", component: BlogView },
    { path: '/cv', name: "Cv", component: CvView },
  ],
})

export default router
