<template>
  <div class="video-timeline">
    <!-- 标题栏 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <Film :size="20" class="text-blue-400" />
        <h4 class="text-sm font-semibold text-gray-200">批量视频生成</h4>
        <span class="text-xs text-gray-500">（批量素材 → 批量视频）</span>
      </div>
      <div class="text-xs text-gray-400">
        共 {{ clips.length }} 个素材，将生成 {{ batchVideos.length }} 个视频
      </div>
    </div>

    <!-- 批量视频列表 -->
    <div class="space-y-4">
      <div
        v-for="(batchVideo, index) in batchVideos"
        :key="batchVideo.id"
        class="bg-gray-900/50 rounded-xl p-4 border border-gray-700"
      >
        <!-- 视频标题 -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {{ index + 1 }}
            </div>
            <h5 class="text-sm font-medium text-gray-200">{{ batchVideo.title }}</h5>
            <span class="text-xs text-gray-500">({{ batchVideo.clips.length }}个素材)</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="p-1.5 text-gray-400 hover:text-gray-200 transition-colors"
              title="编辑视频"
              @click="handleEditBatch(batchVideo)"
            >
              <Edit3 :size="14" />
            </button>
            <button
              class="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
              title="删除视频"
              @click="handleDeleteBatch(batchVideo)"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>

        <!-- 素材时间线 -->
        <div class="timeline-container">
          <draggable
            v-model="batchVideo.clips"
            item-key="id"
            class="flex gap-2 overflow-x-auto scrollbar-thin pb-2"
            :animation="200"
            ghost-class="ghost"
            @end="() => handleReorderBatch(batchVideo)"
          >
            <template #item="{ element: clip, index }">
              <div
                class="clip-card group relative flex-shrink-0 w-24 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-blue-500 transition-all duration-200 cursor-move"
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
                    <Film :size="20" />
                  </div>

                  <!-- 序号标签 -->
                  <div class="absolute top-1 left-1 px-1 py-0.5 bg-black/70 text-white text-xs font-bold rounded">
                    {{ index + 1 }}
                  </div>

                  <!-- 悬停操作按钮 -->
                  <div
                    v-show="hoveredClipId === clip.id"
                    class="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
                  >
                    <button
                      class="p-1 bg-red-500 text-white rounded hover:bg-red-600 active:scale-95 transition-all"
                      title="移除素材"
                      @click.stop="handleRemoveClip(batchVideo, clip)"
                    >
                      <X :size="12" />
                    </button>
                  </div>
                </div>

                <!-- 片段信息 -->
                <div class="p-1">
                  <p class="text-xs font-medium text-gray-200 truncate" :title="clip.title">
                    {{ clip.title }}
                  </p>
                  <p class="text-xs text-gray-500">{{ clip.duration }}</p>
                </div>
              </div>
            </template>
          </draggable>

          <!-- 添加素材按钮 -->
          <button
            class="flex-shrink-0 w-24 h-16 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center hover:border-blue-500 hover:bg-gray-700 transition-all"
            @click="handleAddClipToBatch(batchVideo)"
          >
            <Plus :size="20" class="text-gray-400" />
          </button>
        </div>

        <!-- 视频设置 -->
        <div class="mt-3 flex items-center gap-4 text-xs text-gray-400">
          <div class="flex items-center gap-1">
            <Clock :size="12" />
            <span>总时长: {{ getBatchDuration(batchVideo) }}</span>
          </div>
          <div class="flex items-center gap-1">
            <Settings :size="12" />
            <span>{{ batchVideo.style || '默认风格' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="mt-6 flex items-center justify-between">
      <button
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
        @click="handleAddBatch"
      >
        <Plus :size="16" />
        <span>新建批量视频</span>
      </button>

      <div class="flex items-center gap-4">
        <button
          class="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-200 text-sm font-medium rounded-lg border border-gray-600 hover:border-blue-500 hover:bg-gray-600 active:scale-95 transition-all"
          @click="handleBatchSettings"
        >
          <Settings :size="16" />
          <span>批量设置</span>
        </button>
        
        <button
          class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-medium rounded-lg hover:brightness-110 active:scale-95 transition-all"
          @click="handleGenerateBatch"
        >
          <Zap :size="16" />
          <span>生成所有视频</span>
        </button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="batchVideos.length === 0" class="text-center py-12 text-gray-500">
      <Film :size="48" class="mx-auto mb-4 text-gray-600" />
      <h3 class="text-lg font-medium text-gray-300 mb-2">开始批量视频制作</h3>
      <p class="text-sm mb-6">上传素材，批量生成多个不同风格的营销视频</p>
      <button
        class="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium rounded-lg hover:brightness-110 transition-all"
        @click="handleAddBatch"
      >
        创建第一个批量视频
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { Film, Edit3, Trash2, Plus, Clock, Settings, Zap, X } from 'lucide-vue-next'

export interface VideoClip {
  id: string
  thumbnail?: string
  title: string
  duration: string
}

export interface BatchVideo {
  id: string
  title: string
  clips: VideoClip[]
  style?: string
  settings?: any
}

interface Props {
  clips: VideoClip[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  reorderBatch: [batchVideo: BatchVideo]
  editBatch: [batchVideo: BatchVideo]
  deleteBatch: [batchVideo: BatchVideo]
  addBatch: []
  addClipToBatch: [batchVideo: BatchVideo]
  removeClipFromBatch: [batchVideo: BatchVideo, clip: VideoClip]
  batchSettings: []
  generateBatch: [batchVideos: BatchVideo[]]
}>()

// 批量视频数据
const batchVideos = ref<BatchVideo[]>([
  {
    id: '1',
    title: '产品展示视频',
    clips: props.clips.slice(0, 3),
    style: '商务风格'
  },
  {
    id: '2', 
    title: '社交媒体视频',
    clips: props.clips.slice(3, 6),
    style: '年轻化风格'
  }
])

const hoveredClipId = ref<string | null>(null)

// 计算批量视频总时长
const getBatchDuration = (batchVideo: BatchVideo) => {
  let totalSeconds = 0
  batchVideo.clips.forEach(clip => {
    const match = clip.duration.match(/(\d+)/)
    if (match && match[1]) {
      totalSeconds += parseInt(match[1])
    }
  })
  
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`
}

// 处理重新排序
const handleReorderBatch = (batchVideo: BatchVideo) => {
  emit('reorderBatch', batchVideo)
}

// 处理编辑批量视频
const handleEditBatch = (batchVideo: BatchVideo) => {
  emit('editBatch', batchVideo)
}

// 处理删除批量视频
const handleDeleteBatch = (batchVideo: BatchVideo) => {
  const index = batchVideos.value.findIndex(b => b.id === batchVideo.id)
  if (index !== -1) {
    batchVideos.value.splice(index, 1)
    emit('deleteBatch', batchVideo)
  }
}

// 处理添加批量视频
const handleAddBatch = () => {
  const newBatch: BatchVideo = {
    id: Date.now().toString(),
    title: `批量视频 ${batchVideos.value.length + 1}`,
    clips: [],
    style: '默认风格'
  }
  batchVideos.value.push(newBatch)
  emit('addBatch')
}

// 处理添加素材到批量视频
const handleAddClipToBatch = (batchVideo: BatchVideo) => {
  emit('addClipToBatch', batchVideo)
}

// 处理从批量视频移除素材
const handleRemoveClip = (batchVideo: BatchVideo, clip: VideoClip) => {
  const index = batchVideo.clips.findIndex(c => c.id === clip.id)
  if (index !== -1) {
    batchVideo.clips.splice(index, 1)
    emit('removeClipFromBatch', batchVideo, clip)
  }
}

// 处理批量设置
const handleBatchSettings = () => {
  emit('batchSettings')
}

// 处理生成批量视频
const handleGenerateBatch = () => {
  emit('generateBatch', batchVideos.value)
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