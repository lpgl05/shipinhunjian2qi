<template>
  <div class="clip-fine-tuner">
    <!-- 工具栏 -->
    <div class="flex items-center justify-between mb-4">
      <div class="text-sm text-gray-400">
        共 {{ clips.length }} 个片段
      </div>
    </div>

    <!-- 片段列表 -->
    <div class="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
      <div
        v-for="(clip, index) in clips"
        :key="clip.id"
        class="clip-item bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors"
      >
        <!-- 头部 -->
        <div class="flex items-start gap-3 mb-4">
          <div class="w-12 h-12 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
            <span class="text-lg font-bold text-gray-400">{{ index + 1 }}</span>
          </div>

          <div class="flex-1">
            <h4 class="text-sm font-semibold text-gray-200 mb-1">{{ clip.title }}</h4>
            <p class="text-xs text-gray-400">总时长: {{ clip.duration }}</p>
          </div>

          <button
            class="icon-btn text-gray-400 hover:text-red-400"
            title="删除片段"
            @click="handleDeleteClip(clip.id)"
          >
            <Trash2 :size="16" />
          </button>
        </div>

        <!-- 时间调整 -->
        <div class="space-y-3 mb-4">
          <div>
            <label class="text-xs text-gray-400 mb-1 block">入点 (秒)</label>
            <input
              v-model.number="clip.startTime"
              type="number"
              min="0"
              :max="clip.endTime"
              step="0.1"
              class="input-primary w-full text-sm"
            />
          </div>

          <div>
            <label class="text-xs text-gray-400 mb-1 block">出点 (秒)</label>
            <input
              v-model.number="clip.endTime"
              type="number"
              :min="clip.startTime"
              step="0.1"
              class="input-primary w-full text-sm"
            />
          </div>

          <div class="flex items-center gap-2 text-xs text-gray-400">
            <Scissors :size="14" />
            <span>实际时长: {{ (clip.endTime - clip.startTime).toFixed(1) }}秒</span>
          </div>
        </div>

        <!-- 音量调整 -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs text-gray-400">音量</label>
            <span class="text-xs text-gray-300">{{ clip.volume }}%</span>
          </div>
          <div class="flex items-center gap-3">
            <VolumeX :size="16" class="text-gray-500" />
            <input
              v-model.number="clip.volume"
              type="range"
              min="0"
              max="200"
              step="5"
              class="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <Volume2 :size="16" class="text-gray-500" />
          </div>
        </div>

        <!-- 快捷操作 -->
        <div class="flex gap-2 mt-4 pt-4 border-t border-gray-600">
          <button
            class="flex-1 btn-secondary text-xs py-2"
            @click="handlePreviewClip(clip)"
          >
            <Play :size="14" class="mr-1" />
            预览
          </button>
          <button
            class="flex-1 btn-secondary text-xs py-2"
            @click="handleResetClip(clip)"
          >
            <RotateCcw :size="14" class="mr-1" />
            重置
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="clips.length === 0" class="text-center py-12">
        <Scissors :size="48" class="mx-auto mb-3 text-gray-600" />
        <p class="text-sm text-gray-400">暂无片段需要调整</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Scissors, Trash2, VolumeX, Volume2, Play, RotateCcw } from 'lucide-vue-next'

interface Clip {
  id: string
  title: string
  duration: string
  startTime: number
  endTime: number
  volume: number
}

const clips = ref<Clip[]>([
  {
    id: '1',
    title: '开场片段',
    duration: '00:10',
    startTime: 0,
    endTime: 10,
    volume: 100
  },
  {
    id: '2',
    title: '主要内容',
    duration: '00:30',
    startTime: 0,
    endTime: 30,
    volume: 80
  }
])

const handleDeleteClip = (id: string) => {
  const index = clips.value.findIndex(c => c.id === id)
  if (index !== -1) {
    clips.value.splice(index, 1)
  }
}

const handlePreviewClip = (clip: Clip) => {
  console.log('预览片段:', clip)
  // TODO: 实现片段预览
}

const handleResetClip = (clip: Clip) => {
  clip.startTime = 0
  clip.volume = 100
  // TODO: 重置到原始值
}
</script>

<style scoped>
/* 自定义滑块样式 */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  background: linear-gradient(to right, #3B82F6, #8B5CF6);
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: linear-gradient(to right, #3B82F6, #8B5CF6);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>

