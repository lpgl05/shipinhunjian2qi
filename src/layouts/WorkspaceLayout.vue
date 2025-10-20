<template>
  <div class="workspace-layout flex h-screen w-full overflow-hidden bg-gray-950">
    <!-- 左侧边栏 -->
    <aside class="w-60 flex-shrink-0 bg-gray-900 border-r border-gray-800">
      <AppSidebar />
    </aside>

    <!-- 中间内容区 -->
    <main class="flex-1 overflow-hidden">
      <ChatCanvas />
    </main>

    <!-- 右侧面板 -->
    <aside 
      v-if="!isRightPanelCollapsed" 
      class="w-80 flex-shrink-0 bg-gray-800 border-l border-gray-700 transition-all duration-300"
    >
      <RightPanel />
    </aside>

    <!-- 右侧面板折叠按钮 -->
    <button
      @click="toggleRightPanel"
      class="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-gray-700 p-2 rounded-l-lg hover:bg-gray-600 transition-colors"
      :class="{ 'right-80': !isRightPanelCollapsed }"
    >
      <ChevronRight v-if="isRightPanelCollapsed" :size="20" class="text-gray-400" />
      <ChevronLeft v-else :size="20" class="text-gray-400" />
    </button>

    <!-- 素材管理器 -->
    <AssetManager />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import AppSidebar from '../views/WorkspacePage/components/AppSidebar.vue'
import ChatCanvas from '../views/WorkspacePage/components/ChatCanvas.vue'
import RightPanel from '../views/WorkspacePage/components/RightPanel.vue'
import AssetManager from '../views/WorkspacePage/components/AssetManager.vue'

const isRightPanelCollapsed = ref(false)

const toggleRightPanel = () => {
  isRightPanelCollapsed.value = !isRightPanelCollapsed.value
}
</script>

