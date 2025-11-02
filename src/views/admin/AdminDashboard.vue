<template>
  <div class="h-screen flex bg-gray-950">
    <!-- 侧边栏 -->
    <aside class="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <!-- Logo -->
      <div class="p-6 border-b border-gray-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Shield :size="20" class="text-white" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-white">后台管理</h2>
            <p class="text-xs text-gray-400">Management</p>
          </div>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 p-4 space-y-2">
        <button
          v-for="item in menuItems"
          :key="item.id"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
          :class="[
            activeMenu === item.id
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          ]"
          @click="activeMenu = item.id"
        >
          <component :is="item.icon" :size="20" />
          <span>{{ item.name }}</span>
        </button>
      </nav>

      <!-- 底部用户信息 -->
      <div class="p-4 border-t border-gray-800">
        <div class="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User :size="16" class="text-white" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-white">{{ adminUser }}</p>
            <p class="text-xs text-gray-400">管理员</p>
          </div>
          <button
            class="p-1.5 text-gray-400 hover:text-red-400 rounded transition-colors"
            @click="handleLogout"
            title="退出登录"
          >
            <LogOut :size="16" />
          </button>
        </div>
      </div>
    </aside>

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 顶部栏 -->
      <header class="h-16 border-b border-gray-800 bg-gray-900/50 px-6 flex items-center justify-between">
        <h1 class="text-xl font-bold text-white">{{ currentMenuTitle }}</h1>
        <div class="text-sm text-gray-400">
          {{ new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }}
        </div>
      </header>

      <!-- 内容区域 -->
      <main class="flex-1 overflow-y-auto p-6">
        <!-- 概览 -->
        <div v-if="activeMenu === 'overview'">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users :size="24" class="text-blue-400" />
                </div>
              </div>
              <h3 class="text-2xl font-bold text-white mb-1">1,234</h3>
              <p class="text-sm text-gray-400">总用户数</p>
            </div>

            <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <FileText :size="24" class="text-green-400" />
                </div>
              </div>
              <h3 class="text-2xl font-bold text-white mb-1">5,678</h3>
              <p class="text-sm text-gray-400">文档总数</p>
            </div>

            <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen :size="24" class="text-purple-400" />
                </div>
              </div>
              <h3 class="text-2xl font-bold text-white mb-1">12,345</h3>
              <p class="text-sm text-gray-400">创作总数</p>
            </div>

            <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Activity :size="24" class="text-orange-400" />
                </div>
              </div>
              <h3 class="text-2xl font-bold text-white mb-1">98.5%</h3>
              <p class="text-sm text-gray-400">系统正常运行率</p>
            </div>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 class="text-lg font-bold text-white mb-4">快速操作</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                v-for="action in quickActions"
                :key="action.id"
                class="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all text-left"
                @click="activeMenu = action.target"
              >
                <component :is="action.icon" :size="24" class="text-blue-400 mb-2" />
                <p class="text-sm font-medium text-white">{{ action.name }}</p>
              </button>
            </div>
          </div>
        </div>

        <!-- 前端配置 -->
        <AdminFrontendConfig v-if="activeMenu === 'frontend'" />

        <!-- 通用知识库 -->
        <AdminKnowledgeBase v-if="activeMenu === 'knowledge'" />

        <!-- 用户管理 -->
        <div v-if="activeMenu === 'users'" class="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 class="text-lg font-bold text-white mb-4">用户管理</h2>
          <p class="text-gray-400">用户管理功能（演示）</p>
        </div>

        <!-- 系统设置 -->
        <div v-if="activeMenu === 'settings'" class="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 class="text-lg font-bold text-white mb-4">系统设置</h2>
          <p class="text-gray-400">系统设置功能（演示）</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Shield,
  LayoutDashboard,
  Palette,
  Database,
  Users,
  Settings,
  LogOut,
  User,
  FileText,
  BookOpen,
  Activity
} from 'lucide-vue-next'
import AdminFrontendConfig from './AdminFrontendConfig.vue'
import AdminKnowledgeBase from './AdminKnowledgeBase.vue'

const router = useRouter()

const adminUser = ref('Admin')
const activeMenu = ref('overview')

const menuItems = [
  { id: 'overview', name: '概览', icon: LayoutDashboard },
  { id: 'frontend', name: '前端配置', icon: Palette },
  { id: 'knowledge', name: '通用知识库', icon: Database },
  { id: 'users', name: '用户管理', icon: Users },
  { id: 'settings', name: '系统设置', icon: Settings }
]

const quickActions = [
  { id: '1', name: '前端配置', icon: Palette, target: 'frontend' },
  { id: '2', name: '知识库管理', icon: Database, target: 'knowledge' },
  { id: '3', name: '用户管理', icon: Users, target: 'users' },
  { id: '4', name: '系统设置', icon: Settings, target: 'settings' }
]

const currentMenuTitle = computed(() => {
  return menuItems.find(item => item.id === activeMenu.value)?.name || '后台管理'
})

const handleLogout = () => {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  router.push('/admin/login')
}
</script>

