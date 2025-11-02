import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginPage.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomePage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: () => import('../views/WorkspacePage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfilePage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/knowledge-agent',
      name: 'knowledge-agent',
      component: () => import('../views/WorkspacePage/agents/KnowledgeAgent/StyleWritingWorkspace.vue'),
      meta: { requiresAuth: true, fullLayout: true }
    },
    {
      path: '/my-documents',
      name: 'my-documents',
      component: () => import('../views/MyDocumentsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/my-creations',
      name: 'my-creations',
      component: () => import('../views/MyCreationsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryPage.vue'),
      meta: { requiresAuth: true }
    },
    // 后台管理系统路由
    {
      path: '/admin',
      redirect: '/admin/login'
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../views/admin/AdminLogin.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('../views/admin/AdminDashboard.vue'),
      meta: { requiresAuth: true, adminOnly: true }
    }
  ]
})

// 认证守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 如果路由需要认证但用户未登录
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  // 如果路由需要访客状态但用户已登录
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
    return
  }
  
  next()
})

export default router


