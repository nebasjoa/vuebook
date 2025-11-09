import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BlogView from '@/views/BlogView.vue'
import BlogPostView from '@/views/BlogPostView.vue'
import CvView from '@/views/CvView.vue'
import CategoryView from '@/views/CategoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: "Home", component: HomeView },
    { path: '/blog', name: "Blog", component: BlogView },
    { path: '/cv', name: "Cv", component: CvView },
    { path: '/blog/:slug',  name: 'BlogPost',  component: BlogPostView },
    { path: '/category/:category',  name: 'Category',  component: CategoryView },
  ],
})

export default router
