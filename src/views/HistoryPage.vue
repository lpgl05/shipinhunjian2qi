<template>
  <div class="h-screen flex bg-white dark:bg-gray-900">
    <!-- 左侧边栏 -->
    <AppSidebar />

    <!-- 主内容区域 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-50">历史记录</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">查看所有智能体生成的内容</p>
          </div>
        </div>
      </header>

      <!-- Agent切换标签 -->
      <div class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6">
        <div class="flex items-center gap-1">
          <button
            v-for="agent in agentTypes"
            :key="agent.value"
            class="px-4 py-3 text-sm font-medium rounded-t-lg transition-all cursor-pointer"
            :class="[
              historyStore.activeAgentType === agent.value
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50'
            ]"
            @click="handleSwitchAgent(agent.value)"
          >
            {{ agent.label }}
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto px-6 py-6">
        <!-- 历史记录列表 -->
        <div v-if="historyStore.groupedRecords.length > 0" class="space-y-8">
          <div
            v-for="group in historyStore.groupedRecords"
            :key="group.date"
            class="space-y-4"
          >
            <!-- 日期标题 -->
            <div class="flex items-center gap-3">
              <h2 class="text-lg font-bold text-gray-700 dark:text-gray-300">{{ group.date }}</h2>
              <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <!-- 当日记录列表 -->
            <div class="space-y-3">
              <div
                v-for="record in group.items"
                :key="record.id"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                @click="handleRecordClick(record)"
              >
                <!-- 时间 -->
                <span class="text-sm text-gray-600 dark:text-gray-500 w-14 flex-shrink-0">
                  {{ formatTime(record.timestamp) }}
                </span>

                <!-- 图标 -->
                <div 
                  class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  :class="getIconClass(record.type)"
                >
                  <component :is="getIcon(record.type)" :size="18" class="text-white" />
                </div>

                <!-- 标题 -->
                <span class="flex-1 text-gray-900 dark:text-gray-300">{{ record.title }}</span>

                <!-- 更多操作 -->
                <button
                  class="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  @click.stop="handleMoreOptions(record)"
                >
                  <MoreVertical :size="16" class="text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl mb-6">
            <Clock :size="40" class="text-gray-400 dark:text-gray-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">暂无历史记录</h3>
          <p class="text-gray-600 dark:text-gray-400">使用智能体生成内容后，将在这里显示</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MessageSquare, FileText, Clock, MoreVertical, Film } from 'lucide-vue-next'
import AppSidebar from './WorkspacePage/AppSidebar.vue'
import { useHistoryStore } from '../store/history'
import type { HistoryRecord } from '../store/history'

const router = useRouter()
const historyStore = useHistoryStore()

// 智能体类型
const agentTypes = [
  { label: '视频混剪', value: 'video-mixer' },
  { label: '风格模仿', value: 'style-imitation' }
]

// 初始化模拟数据
onMounted(() => {
  historyStore.initMockData()
})

/**
 * 切换到不同的智能体类型
 */
const handleSwitchAgent = (type: 'video-mixer' | 'style-imitation') => {
  historyStore.setActiveAgentType(type)
}

/**
 * 点击历史记录项
 */
const handleRecordClick = (record: HistoryRecord) => {
  if (record.agentType === 'video-mixer') {
    // 跳转到视频混剪智能体的结果页面
    router.push({
      path: '/workspace',
      query: {
        agent: 'video-mixer',
        result: record.id
      }
    })
  } else if (record.agentType === 'style-imitation') {
    // 跳转到风格模仿的结果页面
    router.push({
      path: '/knowledge-agent',
      query: {
        result: record.id
      }
    })
  }
}

/**
 * 更多选项
 */
const handleMoreOptions = (record: HistoryRecord) => {
  console.log('更多选项:', record)
  // TODO: 显示下拉菜单，包含删除等功能
}

/**
 * 格式化时间
 */
const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * 获取图标
 */
const getIcon = (type: HistoryRecord['type']) => {
  switch (type) {
    case 'video-mixer':
      return Film
    case 'style-imitation':
      return FileText
    case 'document':
      return FileText
    case 'chat':
      return MessageSquare
    default:
      return Clock
  }
}

/**
 * 获取图标背景色
 */
const getIconClass = (type: HistoryRecord['type']) => {
  switch (type) {
    case 'video-mixer':
      return 'bg-blue-500'
    case 'style-imitation':
      return 'bg-purple-500'
    case 'document':
      return 'bg-green-500'
    case 'chat':
      return 'bg-violet-500'
    default:
      return 'bg-gray-600'
  }
}
</script>

<style scoped>
/* 平滑滚动 */
main {
  scroll-behavior: smooth;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #F3F4F6;
}

::-webkit-scrollbar-thumb {
  background: #D1D5DB;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF;
}

.dark ::-webkit-scrollbar-track {
  background: #1F2937;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4B5563;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}
</style>

