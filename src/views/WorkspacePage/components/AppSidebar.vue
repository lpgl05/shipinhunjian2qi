<template>
  <div class="app-sidebar h-full flex flex-col">
    <!-- 顶部Logo区域 -->
    <div class="p-6 border-b border-gray-800">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
          <Video :size="24" class="text-white" />
        </div>
        <div>
          <h1 class="text-lg font-bold text-gray-50">AI混剪</h1>
          <p class="text-xs text-gray-400">智能视频创作</p>
        </div>
      </div>
    </div>

    <!-- 新建项目按钮 -->
    <div class="p-4">
      <button class="btn-primary w-full flex items-center justify-center gap-2">
        <Plus :size="20" />
        <span>新建项目</span>
      </button>
    </div>

    <!-- 导航菜单 -->
    <nav class="flex-1 px-3 py-2 space-y-1 scrollbar-thin overflow-y-auto">
      <a
        v-for="item in menuItems"
        :key="item.name"
        href="#"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-50 transition-all duration-200"
        :class="{ 'bg-gray-800 text-gray-50': item.active }"
      >
        <component :is="item.icon" :size="20" />
        <span class="text-sm font-medium">{{ item.name }}</span>
      </a>
    </nav>

    <!-- 底部用户信息 -->
    <div class="p-4 border-t border-gray-800">
      <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
        <div class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
          <User :size="20" class="text-gray-400" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-50 truncate">用户名</p>
          <p class="text-xs text-gray-400">免费版</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Video, Plus, Home, Folder, Clock, Settings, User } from 'lucide-vue-next'

const menuItems = [
  { name: '首页', icon: Home, active: false },
  { name: '我的项目', icon: Folder, active: true },
  { name: '历史记录', icon: Clock, active: false },
  { name: '设置', icon: Settings, active: false },
]
</script>

