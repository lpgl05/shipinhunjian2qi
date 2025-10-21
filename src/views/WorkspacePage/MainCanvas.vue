<template>
  <div class="main-canvas h-full flex flex-col bg-gray-800">
    <!-- 顶部Header -->
    <div class="header flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-900">
      <!-- 左侧：标题 -->
      <div class="flex items-center gap-3">
        <div 
          class="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r"
          :class="agentGradient"
        >
          <component :is="agentIcon" :size="20" class="text-white" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-50">{{ agentTitle }}</h2>
          <p class="text-xs text-gray-400">{{ agentSubtitle }}</p>
        </div>
      </div>

      <!-- 右侧：控制按钮 -->
      <div class="flex items-center gap-2">
        <!-- 收起/展开ChatCanvas -->
        <Tooltip :text="workspaceStore.isChatMode ? '展开画布' : '收起画布'">
          <button 
            class="icon-btn"
            @click="toggleCanvas"
          >
            <PanelLeftClose v-if="!workspaceStore.isChatMode" :size="20" />
            <PanelLeftOpen v-else :size="20" />
          </button>
        </Tooltip>

        <!-- 全屏 -->
        <Tooltip text="全屏">
          <button 
            class="icon-btn"
            @click="toggleFullscreen"
          >
            <Maximize2 v-if="!isFullscreen" :size="20" />
            <Minimize2 v-else :size="20" />
          </button>
        </Tooltip>

        <!-- 更多选项 -->
        <Tooltip text="更多">
          <button class="icon-btn">
            <MoreVertical :size="20" />
          </button>
        </Tooltip>
      </div>
    </div>

    <!-- 画布内容区 (动态加载智能体) -->
    <div class="flex-1 overflow-hidden">
      <component :is="currentAgentComponent" v-if="currentAgentComponent" />
      <div v-else class="flex items-center justify-center h-full text-gray-500">
        <div class="text-center">
          <Sparkles :size="48" class="mx-auto mb-4 text-gray-600" />
          <p>未选择智能体</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { 
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
  Minimize2,
  MoreVertical,
  Scissors,
  Type,
  Share2,
  Wand2,
  BarChart3,
  Target
} from 'lucide-vue-next'
import { useWorkspaceStore } from '../../store/workspace'
import Tooltip from './components/Tooltip.vue'

const workspaceStore = useWorkspaceStore()
const isFullscreen = ref(false)

// 智能体配置映射
const agentConfig: Record<string, any> = {
  'video-mixer': {
    title: '视频混剪智能体',
    subtitle: '批量素材生成批量视频',
    icon: Scissors,
    gradient: 'from-blue-500 to-cyan-500',
    component: defineAsyncComponent(() => import('./agents/VideoAgent/VideoEditingCanvas.vue'))
  },
  'content-rewrite': {
    title: '知识库仿写智能体',
    subtitle: '智能仿写营销文案',
    icon: Type,
    gradient: 'from-purple-500 to-pink-500',
    component: null // TODO: 实现
  },
  'social-media': {
    title: '社媒运营智能体',
    subtitle: '全平台内容分发',
    icon: Share2,
    gradient: 'from-green-500 to-emerald-500',
    component: null // TODO: 实现
  },
  'brand-design': {
    title: '品牌设计智能体',
    subtitle: '一键生成品牌视觉素材',
    icon: Wand2,
    gradient: 'from-orange-500 to-red-500',
    component: null // TODO: 实现
  },
  'data-analysis': {
    title: '数据分析智能体',
    subtitle: '营销数据深度分析',
    icon: BarChart3,
    gradient: 'from-indigo-500 to-blue-500',
    component: null // TODO: 实现
  },
  'campaign-manager': {
    title: '营销策划智能体',
    subtitle: '全链路营销策划',
    icon: Target,
    gradient: 'from-violet-500 to-purple-500',
    component: null // TODO: 实现
  }
}

// 当前智能体配置
const currentConfig = computed(() => {
  if (!workspaceStore.activeAgent) return null
  return agentConfig[workspaceStore.activeAgent] || null
})

// 当前智能体标题
const agentTitle = computed(() => currentConfig.value?.title || '智能体画布')
const agentSubtitle = computed(() => currentConfig.value?.subtitle || '')
const agentIcon = computed(() => currentConfig.value?.icon || Sparkles)
const agentGradient = computed(() => currentConfig.value?.gradient || 'from-blue-500 to-violet-500')

// 当前智能体组件
const currentAgentComponent = computed(() => {
  return currentConfig.value?.component || null
})

// 切换画布
const toggleCanvas = () => {
  workspaceStore.toggleLayoutMode()
}

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>

<style scoped>
.main-canvas {
  /* 确保画布占满空间 */
  position: relative;
}

.icon-btn {
  @apply p-2 text-gray-400 hover:text-gray-50 hover:bg-gray-700 rounded-lg transition-all;
}

.icon-btn:active {
  @apply scale-95;
}
</style>

