<template>
  <div class="workspace-layout flex h-screen w-full overflow-hidden bg-gray-900">
    <!-- 极简侧边栏 (固定最左侧) -->
    <AppSidebar />

    <!-- 对话画布 (动态宽度) -->
    <div 
      class="chat-canvas-container flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden"
      :class="getChatCanvasWidth()"
    >
      <ChatCanvas />
    </div>

    <!-- 主画布 (条件渲染，动态宽度) -->
    <div 
      v-if="workspaceStore.isCreationMode"
      class="main-canvas-container flex-1 transition-all duration-300 ease-in-out"
    >
      <MainCanvas />
    </div>

    <!-- AI云盘模态框 -->
    <AssetManager />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWorkspaceStore } from '../store/workspace'
import AppSidebar from '../views/WorkspacePage/AppSidebar.vue'
import ChatCanvas from '../views/WorkspacePage/ChatCanvas.vue'
import MainCanvas from '../views/WorkspacePage/MainCanvas.vue'
import AssetManager from '../views/WorkspacePage/components/AssetManager.vue'

const workspaceStore = useWorkspaceStore()

/**
 * 获取ChatCanvas的宽度类
 * - 不在创作模式: w-full (占满全屏)
 * - 在创作模式:
 *   - chatPanelCollapsed=false: w-1/3 (显示)
 *   - chatPanelCollapsed=true: w-0 (隐藏)
 */
const getChatCanvasWidth = () => {
  if (!workspaceStore.isCreationMode) {
    // 不在创作模式，ChatCanvas占满全屏
    return 'w-full'
  } else {
    // 在创作模式下，根据chatPanelCollapsed状态决定宽度
    return workspaceStore.chatPanelCollapsed ? 'w-0' : 'w-1/3'
  }
}
</script>

<style scoped>
.workspace-layout {
  /* 防止子元素溢出 */
  overflow: hidden;
}

/* 平滑过渡动画 */
.chat-canvas-container,
.main-canvas-container {
  will-change: width;
}

/* 优化渲染性能 */
.workspace-layout * {
  box-sizing: border-box;
}
</style>
