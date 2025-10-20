<template>
  <div class="video-timeline">
    <!-- 标题栏 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <Film :size="20" class="text-blue-400" />
        <h4 class="text-sm font-semibold text-gray-200">视频时间线</h4>
        <span class="text-xs text-gray-500">（拖拽调整顺序）</span>
      </div>
      <div class="text-xs text-gray-400">
        共 {{ clips.length }} 个片段
      </div>
    </div>

    <!-- 时间线容器 -->
    <div class="timeline-container bg-gray-900/50 rounded-xl p-4 border border-gray-700">
      <draggable
        v-model="localClips"
        item-key="id"
        class="flex gap-3 overflow-x-auto scrollbar-thin pb-2"
        :animation="200"
        ghost-class="ghost"
        @end="handleReorder"
      >
        <template #item="{ element: clip, index }">
          <div
            class="clip-card group relative flex-shrink-0 w-36 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-blue-500 transition-all duration-200 cursor-move"
            @mouseenter="hoveredClipId = clip.id"
            @mouseleave="hoveredClipId = null"
          >
            <!-- 缩略图 -->
            <div class="aspect-video bg-gray-700 flex items-center justify-center relative overflow-hidden">
              <img
                v-if="clip.thumbnail"
                :src="clip.thumbnail"
                :alt="clip.title"
                class="w-full h-full object-cover"
              />
              <div v-else class="text-gray-600">
                <Film :size="32" />
              </div>

              <!-- 序号标签 -->
              <div class="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-white text-xs font-bold rounded">
                {{ index + 1 }}
              </div>

              <!-- 时长标签 -->
              <div class="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs font-medium rounded">
                {{ clip.duration }}
              </div>

              <!-- 悬停操作按钮 -->
              <div
                v-show="hoveredClipId === clip.id"
                class="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-2"
              >
                <button
                  class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95 transition-all"
                  title="替换片段"
                  @click.stop="handleReplace(clip)"
                >
                  <RefreshCw :size="16" />
                </button>
                <button
                  class="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transition-all"
                  title="删除片段"
                  @click.stop="handleDelete(clip)"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
            </div>

            <!-- 片段信息 -->
            <div class="p-2">
              <p class="text-xs font-medium text-gray-200 truncate" :title="clip.title">
                {{ clip.title }}
              </p>
            </div>

            <!-- 拖拽手柄指示器 -->
            <div class="absolute top-1 right-1 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical :size="16" />
            </div>
          </div>
        </template>
      </draggable>

      <!-- 空状态 -->
      <div v-if="clips.length === 0" class="text-center py-8 text-gray-500">
        <Film :size="48" class="mx-auto mb-2 text-gray-600" />
        <p class="text-sm">暂无视频片段</p>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="mt-4 flex items-center justify-between">
      <button
        class="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-200 text-sm font-medium rounded-lg border border-gray-600 hover:border-blue-500 hover:bg-gray-600 active:scale-95 transition-all"
        @click="handleAddClip"
      >
        <Plus :size="16" />
        <span>添加片段</span>
      </button>

      <div class="flex items-center gap-2 text-xs text-gray-400">
        <Clock :size="14" />
        <span>总时长: {{ totalDuration }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import { Film, RefreshCw, Trash2, GripVertical, Plus, Clock } from 'lucide-vue-next'

export interface VideoClip {
  id: string
  thumbnail?: string
  title: string
  duration: string
}

interface Props {
  clips: VideoClip[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  reorder: [clips: VideoClip[]]
  replace: [clip: VideoClip]
  delete: [clip: VideoClip]
  addClip: []
}>()

const localClips = ref<VideoClip[]>([...props.clips])
const hoveredClipId = ref<string | null>(null)

// 计算总时长
const totalDuration = computed(() => {
  let totalSeconds = 0
  localClips.value.forEach(clip => {
    const match = clip.duration.match(/(\d+)/)
    if (match) {
      totalSeconds += parseInt(match[1])
    }
  })
  
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`
})

// 处理重新排序
const handleReorder = () => {
  emit('reorder', localClips.value)
}

// 处理替换片段
const handleReplace = (clip: VideoClip) => {
  emit('replace', clip)
}

// 处理删除片段
const handleDelete = (clip: VideoClip) => {
  const index = localClips.value.findIndex(c => c.id === clip.id)
  if (index !== -1) {
    localClips.value.splice(index, 1)
    emit('delete', clip)
  }
}

// 处理添加片段
const handleAddClip = () => {
  emit('addClip')
}
</script>

<style scoped>
/* 拖拽时的幽灵样式 */
.ghost {
  opacity: 0.5;
  background: #3B82F6;
  border-color: #3B82F6;
}

/* 自定义滚动条 */
.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #1F2937;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}
</style>

