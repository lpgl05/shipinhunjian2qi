<template>
  <div class="workspace-layout flex h-screen w-full overflow-hidden bg-gray-950">
    <!-- 左侧边栏 - 固定收起状态 -->
    <aside class="w-16 flex-shrink-0 bg-gray-900 border-r border-gray-800">
      <AppSidebar :is-collapsed="true" />
    </aside>

    <!-- 中间内容区 -->
    <main class="flex-shrink-0 overflow-hidden transition-all duration-300" :class="chatWidth">
      <ChatCanvas />
    </main>

    <!-- 右侧面板 -->
    <aside 
      v-if="!isRightPanelCollapsed" 
      class="flex-shrink-0 bg-gray-800 border-l border-gray-700 transition-all duration-300"
      :class="rightPanelWidth"
    >
      <RightPanel />
    </aside>

    <!-- 右侧面板控制按钮组 -->
    <div class="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
      <!-- 全屏按钮 -->
      <button
        @click="toggleFullscreen"
        class="bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition-colors"
        title="全屏预览"
      >
        <Maximize2 v-if="!isFullscreen" :size="20" class="text-gray-400" />
        <Minimize2 v-else :size="20" class="text-gray-400" />
      </button>
      
      <!-- 右侧面板折叠按钮 -->
      <button
        @click="toggleRightPanel"
        class="bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition-colors"
        title="切换右侧面板"
      >
        <ChevronRight v-if="isRightPanelCollapsed" :size="20" class="text-gray-400" />
        <ChevronLeft v-else :size="20" class="text-gray-400" />
      </button>
    </div>

    <!-- 素材管理器 -->
    <AssetManager />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-vue-next'
import AppSidebar from '../views/WorkspacePage/components/AppSidebar.vue'
import ChatCanvas from '../views/WorkspacePage/components/ChatCanvas.vue'
import RightPanel from '../views/WorkspacePage/components/RightPanel.vue'
import AssetManager from '../views/WorkspacePage/components/AssetManager.vue'

const isRightPanelCollapsed = ref(false)
const isFullscreen = ref(false)

// 动态宽度计算 - 新的布局比例
const sidebarWidth = computed(() => {
  return 'w-16' // 固定收起宽度
})

const chatWidth = computed(() => {
  if (isFullscreen.value) {
    return 'w-0' // 全屏时隐藏聊天区域
  } else {
    return 'w-80' // 固定聊天区域宽度
  }
})

const rightPanelWidth = computed(() => {
  if (isFullscreen.value) {
    return 'w-full' // 全屏时占满整个屏幕
  } else {
    return 'flex-1' // 默认占满剩余空间
  }
})


const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}
</script>

<style scoped>
.workspace-layout {
  transition: all 0.3s ease;
}
</style>