import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: "Home", component: HomeView },
    // { path: '/registration', name: 'Registration', component: () => import('@/views/RegistrationView.vue') },
    { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue') },
  ],
})

export default router
