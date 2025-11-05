<template>
  <div class="ai-results-viewer bg-gray-800 rounded-lg border border-gray-700">
    <!-- 头部 -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-700">
      <h3 class="font-semibold text-gray-200">AI识别结果</h3>
      <div class="flex items-center gap-2">
        <button 
          @click="exportResults"
          class="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
        >
          导出
        </button>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-200"
        >
          <X :size="16" />
        </button>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="px-4 py-3 border-b border-gray-700">
      <div class="grid grid-cols-4 gap-4 text-center">
        <div class="bg-gray-700/50 rounded-lg p-3">
          <div class="text-lg font-semibold text-blue-400">{{ totalScenes }}</div>
          <div class="text-xs text-gray-400">场景切换</div>
        </div>
        <div class="bg-gray-700/50 rounded-lg p-3">
          <div class="text-lg font-semibold text-orange-400">{{ totalMotions }}</div>
          <div class="text-xs text-gray-400">运动检测</div>
        </div>
        <div class="bg-gray-700/50 rounded-lg p-3">
          <div class="text-lg font-semibold text-green-400">{{ totalAudios }}</div>
          <div class="text-xs text-gray-400">音频峰值</div>
        </div>
        <div class="bg-gray-700/50 rounded-lg p-3">
          <div class="text-lg font-semibold text-purple-400">{{ totalFaces }}</div>
          <div class="text-xs text-gray-400">人脸特写</div>
        </div>
      </div>
    </div>

    <!-- 结果列表 -->
    <div class="max-h-96 overflow-y-auto">
      <div v-if="results.length === 0" class="text-center py-8 text-gray-400">
        <Sparkles :size="32" class="mx-auto mb-2 text-gray-600" />
        <p>暂无识别结果</p>
      </div>

      <div v-else class="p-4 space-y-3">
        <div 
          v-for="(result, index) in sortedResults" 
          :key="index"
          class="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="font-mono text-sm text-gray-300">{{ result.time }}</span>
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="getTypeColor(result.type)"
                >
                  {{ getTypeLabel(result.type) }}
                </span>
                <div class="flex items-center gap-1">
                  <div 
                    class="w-2 h-2 rounded-full"
                    :class="getConfidenceColor(result.confidence)"
                  ></div>
                  <span class="text-xs text-gray-400">
                    {{ Math.round(result.confidence * 100) }}%
                  </span>
                </div>
              </div>
              <p class="text-sm text-gray-200">{{ result.description }}</p>
            </div>
            <button 
              @click="playAtTime(result.time)"
              class="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-600 rounded-lg transition-colors"
              title="从此处播放"
            >
              <Play :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="px-4 py-3 border-t border-gray-700">
      <div class="flex gap-2">
        <button 
          @click="applyAllTags"
          class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
        >
          应用所有标签
        </button>
        <button 
          @click="selectImportant"
          class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors text-sm"
        >
          选择重要片段
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X, Sparkles, Play } from 'lucide-vue-next'

interface AIResult {
  time: string
  type: 'scene' | 'motion' | 'audio' | 'face'
  description: string
  confidence: number
}

const props = defineProps<{
  results: AIResult[]
  videoDuration?: number
}>()

const emit = defineEmits<{
  'close': []
  'play': [time: string]
  'export': [results: AIResult[]]
  'apply-tags': [results: AIResult[]]
  'select-important': [results: AIResult[]]
}>()

const sortedResults = computed(() => {
  return [...props.results].sort((a, b) => {
    const timeA = timeToSeconds(a.time)
    const timeB = timeToSeconds(b.time)
    return timeA - timeB
  })
})

const totalScenes = computed(() => props.results.filter(r => r.type === 'scene').length)
const totalMotions = computed(() => props.results.filter(r => r.type === 'motion').length)
const totalAudios = computed(() => props.results.filter(r => r.type === 'audio').length)
const totalFaces = computed(() => props.results.filter(r => r.type === 'face').length)

const timeToSeconds = (time: string): number => {
  const parts = time.split(':').map(Number)
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]
  }
  return parts[0] || 0
}

const getTypeLabel = (type: string): string => {
  const labels = {
    scene: '场景',
    motion: '运动', 
    audio: '音频',
    face: '人脸'
  }
  return labels[type as keyof typeof labels] || type
}

const getTypeColor = (type: string): string => {
  const colors = {
    scene: 'bg-purple-500/20 text-purple-300',
    motion: 'bg-orange-500/20 text-orange-300',
    audio: 'bg-green-500/20 text-green-300', 
    face: 'bg-blue-500/20 text-blue-300'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-300'
}

const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.9) return 'bg-green-500'
  if (confidence >= 0.7) return 'bg-yellow-500'
  return 'bg-red-500'
}

const playAtTime = (time: string) => {
  emit('play', time)
}

const exportResults = () => {
  emit('export', props.results)
}

const applyAllTags = () => {
  emit('apply-tags', props.results)
}

const selectImportant = () => {
  const important = props.results.filter(r => r.confidence >= 0.8)
  emit('select-important', important)
}
</script>