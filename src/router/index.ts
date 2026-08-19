import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import { session } from '../services/api'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: () => import('../views/auth/LoginView.vue'), meta: { public: true } },
    { path: '/', component: AppLayout, redirect: '/dashboard', children: [
      { path: 'dashboard', name: 'dashboard', component: () => import('../views/dashboard/DashboardView.vue') },
      { path: 'requests', name: 'requests', component: () => import('../views/requests/RequestListView.vue') },
      { path: 'requests/new', name: 'request-create', component: () => import('../views/requests/RequestCreateView.vue') },
      { path: 'requests/:id', name: 'request-detail', component: () => import('../views/requests/RequestDetailView.vue') },
      { path: 'requests/:id/edit', name: 'request-edit', component: () => import('../views/requests/RequestEditView.vue') },
      { path: 'users', name: 'users', component: () => import('../views/users/UserListView.vue'), meta: { admin: true } },
      { path: 'users/:id/edit', name: 'user-edit', component: () => import('../views/users/UserEditView.vue'), meta: { admin: true } },
      { path: 'settings', name: 'settings', component: () => import('../views/settings/SettingsView.vue') },
    ] },
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
router.beforeEach((to) => { if (!to.meta.public && !session.token) return { name: 'login', query: { redirect: to.fullPath } }; if (to.name === 'login' && session.token) return { name: 'dashboard' } })
export default router
