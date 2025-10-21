<template>
  <div class="video-timeline bg-gray-800 rounded-xl p-6 border border-gray-700">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-50 flex items-center gap-2">
        <Film :size="20" class="text-blue-400" />
        视频时间线
      </h3>
      <button 
        class="btn-primary flex items-center gap-2"
        @click="handleStartEditing"
      >
        <Edit :size="16" />
        <span>开始编辑</span>
      </button>
    </div>

    <!-- 时间线内容 -->
    <div class="space-y-3">
      <div 
        v-for="clip in clips" 
        :key="clip.id"
        class="timeline-clip bg-gray-700 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-600 transition-colors cursor-pointer"
      >
        <div class="w-16 h-12 bg-gray-600 rounded flex items-center justify-center">
          <Play :size="20" class="text-gray-400" />
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-medium text-gray-50">{{ clip.title }}</h4>
          <p class="text-xs text-gray-400">{{ clip.duration }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="icon-btn-sm" title="预览">
            <Eye :size="16" />
          </button>
          <button class="icon-btn-sm" title="编辑">
            <Edit :size="16" />
          </button>
          <button class="icon-btn-sm text-red-400" title="删除">
            <Trash2 :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- 总时长 -->
    <div class="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
      <span class="text-sm text-gray-400">总时长: 25秒</span>
      <button class="btn-secondary text-sm">
        添加片段
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Film, 
  Edit, 
  Play, 
  Eye, 
  Trash2 
} from 'lucide-vue-next'

interface Clip {
  id: string
  thumbnail: string
  title: string
  duration: string
}

const props = defineProps<{
  clips: Clip[]
}>()

// 开始编辑
const handleStartEditing = () => {
  // 触发UGI事件，激活视频混剪智能体
  emit('select', { agentId: 'video-mixer', action: 'start-editing' })
}

// 定义事件
const emit = defineEmits<{
  select: [data: any]
}>()
</script>

<style scoped>
.icon-btn-sm {
  @apply p-1.5 text-gray-400 hover:text-gray-50 hover:bg-gray-600 rounded-lg transition-all;
}
</style>