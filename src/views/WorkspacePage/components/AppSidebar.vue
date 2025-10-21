<template>
  <div class="app-sidebar h-full flex flex-col" :class="{ 'w-16': isCollapsed, 'w-64': !isCollapsed }">
    <!-- 顶部Logo区域 -->
    <div class="p-4 border-b border-gray-800">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3" v-show="!isCollapsed">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
            <Video :size="24" class="text-white" />
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-50">智策营销</h1>
            <p class="text-xs text-gray-400">智能营销平台</p>
          </div>
        </div>
        <div v-show="isCollapsed" class="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
          <Video :size="24" class="text-white" />
        </div>
        <!-- 收起/展开按钮 -->
        <button 
          @click="toggleCollapse"
          class="text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ChevronLeft v-if="!isCollapsed" :size="20" />
          <ChevronRight v-else :size="20" />
        </button>
      </div>
    </div>

    <!-- 新建项目按钮 -->
    <div class="p-4">
      <button class="btn-primary w-full flex items-center justify-center gap-2" :class="{ 'px-2': isCollapsed }">
        <Plus :size="20" />
        <span v-show="!isCollapsed">新建项目</span>
      </button>
    </div>

    <!-- 导航菜单 -->
    <nav class="flex-1 px-3 py-2 space-y-1 scrollbar-thin overflow-y-auto">
      <button
        v-for="item in menuItems"
        :key="item.name"
        @click="item.action ? item.action() : null"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-50 transition-all duration-200 w-full"
        :class="{ 'bg-gray-800 text-gray-50': item.active, 'justify-center': isCollapsed }"
        :title="isCollapsed ? item.name : ''"
      >
        <component :is="item.icon" :size="20" />
        <span class="text-sm font-medium" v-show="!isCollapsed">{{ item.name }}</span>
      </button>
    </nav>

    <!-- 视频混剪路径提示 -->
    <div v-show="!isCollapsed" class="px-3 py-4 border-t border-gray-800">
      <h3 class="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
        <Video :size="16" class="text-blue-400" />
        视频混剪路径
      </h3>
      <div class="space-y-3">
        <div
          v-for="step in videoMixSteps"
          :key="step.step"
          class="flex items-start gap-3 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
        >
          <div class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {{ step.step }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium text-gray-200">{{ step.title }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部用户信息 -->
    <div class="p-4 border-t border-gray-800">
      <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors" :class="{ 'justify-center': isCollapsed }" :title="isCollapsed ? '用户名 - 免费版' : ''">
        <div class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
          <User :size="20" class="text-gray-400" />
        </div>
        <div class="flex-1 min-w-0" v-show="!isCollapsed">
          <p class="text-sm font-medium text-gray-50 truncate">用户名</p>
          <p class="text-xs text-gray-400">免费版</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Video, Plus, Home, Folder, Clock, Settings, User, Cloud, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useAssetStore } from '../../../store/asset'

const assetStore = useAssetStore()
const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const menuItems = [
  { name: '首页', icon: Home, active: false },
  { name: '我的项目', icon: Folder, active: true },
  { name: '云盘', icon: Cloud, active: false, action: () => assetStore.showAssetManager = true },
  { name: '历史记录', icon: Clock, active: false },
  { name: '设置', icon: Settings, active: false },
]

// 视频混剪路径步骤
const videoMixSteps = [
  { step: 1, title: '添加视频素材', description: '从云盘选择或直接上传', icon: 'Video' },
  { step: 2, title: '添加BGM背景音乐', description: 'AI自动生成匹配或手动选择', icon: 'Music' },
  { step: 3, title: '添加字幕', description: 'AI自动生成或手动填写', icon: 'Type' },
  { step: 4, title: '添加配音', description: 'AI自动生成或上传音频', icon: 'Mic' }
]
</script>

