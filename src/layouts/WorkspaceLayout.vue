<template>
  <div class="workspace-layout flex h-screen w-full overflow-hidden bg-gray-950">
    <!-- 左侧边栏 -->
    <aside class="flex-shrink-0 bg-gray-900 border-r border-gray-800 transition-all duration-300" :class="sidebarWidth">
      <AppSidebar />
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

const isRightPanelCollapsed = ref(true)
const isFullscreen = ref(false)

// 动态宽度计算
const sidebarWidth = computed(() => {
  return isRightPanelCollapsed.value && isFullscreen.value ? 'w-16' : 'w-80'
})

const chatWidth = computed(() => {
  if (isFullscreen.value && isRightPanelCollapsed.value) {
    return 'w-full'
  } else if (isFullscreen.value) {
    return 'w-1/2'
  } else if (isRightPanelCollapsed.value) {
    return 'flex-1'
  } else {
    return 'w-80'
  }
})

const rightPanelWidth = computed(() => {
  if (isFullscreen.value) {
    return 'w-full'
  } else if (!isRightPanelCollapsed.value) {
    return 'w-2/3' // 智能体页面时右侧画布更大
  }
  return 'w-96'
})

const toggleRightPanel = () => {
  isRightPanelCollapsed.value = !isRightPanelCollapsed.value
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}
</script>

<style scoped>
.workspace-layout {
  transition: all 0.3s ease;
}
</style>