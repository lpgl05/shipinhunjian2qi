<template>
  <aside class="app-sidebar w-16 h-full bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4">
    <!-- Logo -->
    <div class="mb-8">
      <div 
        class="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
        @click="handleBackToHome"
        title="返回首页"
      >
        <Sparkles :size="20" class="text-white" />
      </div>
    </div>

    <!-- Navigation Icons -->
    <nav class="flex-1 flex flex-col items-center gap-2">
      <!-- 新建对话 -->
      <Tooltip text="新建对话">
        <button 
          class="sidebar-icon-btn"
          :class="{ 'active': workspaceStore.isChatMode && !workspaceStore.activeAgent }"
          @click="handleNewChat"
        >
          <PlusCircle :size="20" />
        </button>
      </Tooltip>

      <!-- 分隔线 -->
      <div class="w-8 h-px bg-gray-800 my-2"></div>

      <!-- AI云盘 -->
      <Tooltip text="AI云盘">
        <button 
          class="sidebar-icon-btn"
          :class="{ 'active': workspaceStore.isAssetModalOpen }"
          @click="workspaceStore.toggleAssetModal()"
        >
          <FolderKanban :size="20" />
        </button>
      </Tooltip>

      <!-- 历史记录 -->
      <Tooltip text="历史记录">
        <button class="sidebar-icon-btn">
          <Clock :size="20" />
        </button>
      </Tooltip>

      <!-- 收藏 -->
      <Tooltip text="收藏">
        <button class="sidebar-icon-btn">
          <Star :size="20" />
        </button>
      </Tooltip>
    </nav>

    <!-- Bottom Actions -->
    <div class="flex flex-col items-center gap-2">
      <!-- 设置 -->
      <Tooltip text="设置">
        <button class="sidebar-icon-btn" @click="handleSettings">
          <Settings :size="20" />
        </button>
      </Tooltip>

      <!-- 用户头像 -->
      <Tooltip text="个人中心">
        <button class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors" @click="handleProfile">
          <User :size="20" class="text-gray-400" />
        </button>
      </Tooltip>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { 
  Sparkles,
  PlusCircle, 
  FolderKanban, 
  Clock,
  Star,
  Settings, 
  User 
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useWorkspaceStore } from '../../store/workspace'
import Tooltip from './components/Tooltip.vue'

const router = useRouter()
const workspaceStore = useWorkspaceStore()

/**
 * 返回首页
 */
const handleBackToHome = () => {
  router.push('/')
}

/**
 * 新建对话
 */
const handleNewChat = () => {
  workspaceStore.startNewSession()
}

/**
 * 跳转到个人中心
 */
const handleProfile = () => {
  router.push('/profile')
}

/**
 * 跳转到设置页面
 */
const handleSettings = () => {
  router.push('/settings')
}
</script>

<style scoped>
.app-sidebar {
  /* 固定宽度，不可调整 */
  flex-shrink: 0;
}

.sidebar-icon-btn {
  @apply w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-50 hover:bg-gray-800 transition-all duration-200 cursor-pointer;
}

.sidebar-icon-btn.active {
  @apply bg-gray-800 text-gray-50;
}

.sidebar-icon-btn:active {
  @apply scale-95;
}
</style>

