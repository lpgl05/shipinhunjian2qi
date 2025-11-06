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
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <template v-for="item in menuItems" :key="item.id">
          <!-- 一级菜单 -->
          <div v-if="!item.children">
            <button
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
          </div>
          
          <!-- 带二级菜单的一级菜单 -->
          <div v-else>
            <button
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
              :class="[
                expandedMenus.includes(item.id) || item.children.some((child: any) => child.id === activeMenu)
                  ? 'text-white bg-gray-800'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              ]"
              @click="toggleMenu(item.id)"
            >
              <component :is="item.icon" :size="20" />
              <span class="flex-1 text-left">{{ item.name }}</span>
              <ChevronDown 
                :size="16" 
                class="transition-transform"
                :class="{ 'rotate-180': expandedMenus.includes(item.id) }"
              />
            </button>
            
            <!-- 二级菜单 -->
            <div
              v-show="expandedMenus.includes(item.id)"
              class="ml-4 mt-1 space-y-1"
            >
              <button
                v-for="child in item.children"
                :key="child.id"
                class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm"
                :class="[
                  activeMenu === child.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                ]"
                @click="activeMenu = child.id"
              >
                <component :is="child.icon" :size="18" />
                <span>{{ child.name }}</span>
              </button>
            </div>
          </div>
        </template>
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

        <!-- 用户管理 -->
        <AdminUserManagement v-if="activeMenu === 'users'" />

        <!-- 企业组织管理 -->
        <AdminOrganizationManagement v-if="activeMenu === 'organizations'" />

        <!-- 风格系统模板管理 -->
        <AdminStyleTemplate v-if="activeMenu === 'style-templates'" />

        <!-- 风格提示词配置 -->
        <AdminFrontendConfig v-if="activeMenu === 'style-prompts'" />

        <!-- 通用知识库 -->
        <AdminKnowledgeBase v-if="activeMenu === 'knowledge'" />

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
  Activity,
  Building2,
  Type,
  Brain,
  ChevronDown,
  Sparkles,
  MessageSquare
} from 'lucide-vue-next'
import AdminFrontendConfig from './AdminFrontendConfig.vue'
import AdminKnowledgeBase from './AdminKnowledgeBase.vue'
import AdminUserManagement from './AdminUserManagement.vue'
import AdminOrganizationManagement from './AdminOrganizationManagement.vue'
import AdminStyleTemplate from './AdminStyleTemplate.vue'

const router = useRouter()

const adminUser = ref('Admin')
const activeMenu = ref('overview')
const expandedMenus = ref<string[]>(['style-agent']) // 默认展开风格智能体

const menuItems = [
  { id: 'overview', name: '概览', icon: LayoutDashboard },
  { id: 'users', name: '用户管理', icon: Users },
  { id: 'organizations', name: '企业组织', icon: Building2 },
  { 
    id: 'style-agent', 
    name: '风格智能体', 
    icon: Sparkles,
    children: [
      { id: 'style-templates', name: '风格系统模板', icon: Type },
      { id: 'style-prompts', name: '风格提示词', icon: MessageSquare }
    ]
  },
  { id: 'knowledge', name: '通用智能体', icon: Brain },
  { id: 'settings', name: '系统设置', icon: Settings }
]

const quickActions = [
  { id: '1', name: '用户管理', icon: Users, target: 'users' },
  { id: '2', name: '企业组织', icon: Building2, target: 'organizations' },
  { id: '3', name: '风格系统模板', icon: Type, target: 'style-templates' },
  { id: '4', name: '风格提示词', icon: MessageSquare, target: 'style-prompts' },
  { id: '5', name: '通用智能体', icon: Brain, target: 'knowledge' },
  { id: '6', name: '系统设置', icon: Settings, target: 'settings' }
]

// 切换菜单展开/收起
const toggleMenu = (menuId: string) => {
  const index = expandedMenus.value.indexOf(menuId)
  if (index > -1) {
    expandedMenus.value.splice(index, 1)
  } else {
    expandedMenus.value.push(menuId)
  }
}

// 获取当前菜单标题（包括二级菜单）
const currentMenuTitle = computed(() => {
  // 先查找一级菜单
  const topLevel = menuItems.find(item => item.id === activeMenu.value)
  if (topLevel) return topLevel.name
  
  // 查找二级菜单
  for (const item of menuItems) {
    if (item.children) {
      const child = item.children.find((c: any) => c.id === activeMenu.value)
      if (child) return child.name
    }
  }
  
  return '后台管理'
})

const handleLogout = () => {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  router.push('/admin/login')
}
</script>

