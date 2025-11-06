import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: "Home", component: () => import('@/views/HomeView.vue') },
    // { path: '/registration', name: 'Registration', component: () => import('@/views/RegistrationView.vue') },
    { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue') },
  ],
})

export default router
